import gulp from "gulp";
import cp from "child_process";
import gutil from "gulp-util";
import postcss from "gulp-postcss";
import cssImport from "postcss-import";
import cssnext from "postcss-cssnext";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";
import svgstore from "gulp-svgstore";
import svgmin from "gulp-svgmin";
import inject from "gulp-inject";
import replace from "gulp-replace";
import cssnano from "cssnano";

const browserSync = BrowserSync.create();
const hugoBin = `./bin/hugo.${process.platform === "win32" ? "exe" : process.platform}`;
const defaultArgs = ["-d", "../dist", "-s", "site"];

gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) => buildSite(cb, ["--buildDrafts", "--buildFuture"]));

gulp.task("cms", (done) => {
  const match = process.env.REPOSITORY_URL ? process.env.REPOSITORY_URL : cp.execSync("git remote -v", {
    encoding: "utf-8"
  });
  let repo = null;
  match.replace(/github.com[:/](\S+)(\.git)?/, (_, m) => {
    repo = m.replace(/\.git$/, "");
  });
  gulp.src("./src/cms/*")
    .pipe(replace("<% GITHUB_REPOSITORY %>", repo))
    .pipe(gulp.dest("./dist/admin"))
    .pipe(browserSync.stream());
  gulp.src(["./node_modules/netlify-cms/dist/*.*", "!./node_modules/netlify-cms/dist/*.html"])
    .pipe(gulp.dest("./dist"))
    .pipe(browserSync.stream());
  done();
});

gulp.task("css", () => (
  gulp.src("./src/css/*.css")
  .pipe(postcss([
    cssImport({
      from: "./src/css/main.css"
    }),
    cssnext(),
    cssnano(),
  ]))
  .pipe(gulp.dest("./dist/css"))
  .pipe(browserSync.stream())
));

gulp.task("js", (cb) => {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true,
      progress: true
    }));
    browserSync.reload();
    cb();
  });
});

gulp.task("build", gulp.series("css", "js", "hugo", "cms"));
gulp.task("build-preview", gulp.series("css", "js", "hugo-preview"));

gulp.task("svg", () => {
  const svgs = gulp
    .src("site/static/img/icons/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }));

  function fileContents(filePath, file) {
    return file.contents.toString();
  }

  return gulp
    .src("site/layouts/partials/svg.html")
    .pipe(inject(svgs, {
      transform: fileContents
    }))
    .pipe(gulp.dest("site/layouts/partials/"));
});

gulp.task("server", gulp.series("hugo", "css", "js", "svg", "cms", (done) => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    },
  });
  gulp.watch("./src/js/**/*.js", gulp.series("js"));
  gulp.watch("./src/css/**/*.css", gulp.series("css"));
  gulp.watch("./src/cms/*", gulp.series("cms"));
  gulp.watch("./site/static/img/icons/*.svg", gulp.series("svg"));
  gulp.watch("./site/**/*", gulp.series("hugo"));

  done();
}));

function buildSite(cb, options) {
  const args = options ? defaultArgs.concat(options) : defaultArgs;

  return cp.spawn(hugoBin, args, {
    stdio: "inherit"
  }).on("close", (code) => {
    if (code === 0) {
      browserSync.reload("notify:false");
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}