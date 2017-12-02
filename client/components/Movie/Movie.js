import React, { Component } from 'react';
import './Movie.scss';

class Movie extends Component {
  render() {
    return (
      <div className="Movie">
        <div className="movie-poster">
          <img src={this.props.movie.Poster} />
        </div>
        <div className="movie-title">
          <h1>{this.props.movie.Title} ({this.props.movie.Year})</h1>
        </div>
        {this.props.srch ? (
          <i className="fa fa-plus-circle" aria-hidden="true"
            onClick={() => this.props.addMovie(this.props.movie)}></i>
        ) : (null)}
      </div>
    );
  }
}

export default Movie;
