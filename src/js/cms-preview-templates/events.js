import React from "react";
import format from "date-fns/format";

export default class EventsPreview extends React.Component {
  render() {
    const {entry, widgetFor} = this.props;

    return <div className="news-page">
      <h1 className="news-page__title">{ entry.getIn(["data", "title"])}</h1>
      <h2 className="news-page__subtitle">{ entry.getIn(["data", "subtitle"])}</h2>
      Публикация
      <div className="news-page__spublication-date">{ format(entry.getIn(["data", "date"]), "MMMM Do YYYY, h:mm:ss a") }</div>
      Начало
      <div className="news-page__spublication-date">{ format(entry.getIn(["data", "eventStartDate"]), "MMMM Do YYYY, hh:mm:ss") }</div>
      Конец
      <div className="news-page__spublication-date">{ format(entry.getIn(["data", "eventEndDate"]), "MMMM Do YYYY, hh:mm:ss") }</div>
      <div className="news-page__description">
        <p>{ entry.getIn(["data", "description"])}</p>
      </div>
      <div className="news-page__image">
        <img src={ entry.getIn(["data", "image"])} alt={ entry.getIn(["data", "title"])} style={{width: "240px"}}/>
      </div>
      <div className="news-page__content">
        { widgetFor("body") }
      </div>
    </div>;
  }
}
