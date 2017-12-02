import React, { Component } from 'react';
import Movie from '../Movie/Movie';
import axios from 'axios';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import './Home.scss';

const apikey = '35dd15b5';

const SortableItem = SortableElement(({value}) =>
  <li style={{listStyle: "none"}}>{value}</li>
);

const SortableList = SortableContainer(({items}) => {
  return (
    <ol>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </ol>
  );
});

class Home extends Component {

  constructor() {
    super();
    this.state = {
      results: [],
      no_results: "",
      items: [
        {
          Poster: "https://images-na.ssl-images-amazon.com/images/M/MV5BMTUyMDA3OTc4MV5BMl5BanBnXkFtZTcwNzE5NjkzMQ@@._V1_SX300.jpg",
          Title: "Test D in The Pick of Destiny",
          Type: "movie",
          Year: "2006",
          imdbID: "tt0365830"
        },
        {
          Poster: "https://images-na.ssl-images-amazon.com/images/M/MV5BMTUyMDA3OTc4MV5BMl5BanBnXkFtZTcwNzE5NjkzMQ@@._V1_SX300.jpg",
          Title: "Tenacious D in The Pick of Destiny",
          Type: "movie",
          Year: "2006",
          imdbID: "tt0365830"
        },
        {
          Poster: "https://images-na.ssl-images-amazon.com/images/M/MV5BMTUyMDA3OTc4MV5BMl5BanBnXkFtZTcwNzE5NjkzMQ@@._V1_SX300.jpg",
          Title: "tttt D in The Pick of Destiny",
          Type: "movie",
          Year: "2006",
          imdbID: "tt0365830"
        }
      ]
    }
    this.srch = this.srch.bind(this);
    this.callOMDB = debounce(this.callOMDB, 150);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.clearResults = this.clearResults.bind(this);
    this.addMovie = this.addMovie.bind(this);
    this.remMovie = this.remMovie.bind(this);
  }

  componentDidMount() {
    axios.get('/auth/me').then((user) => {
      console.log(user);
    });
  }

  onSortEnd({oldIndex, newIndex}) {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex)
    });
  };

  callOMDB(srch) {
    var state = Object.assign({}, this.state);
    var Home = this;
    var url = `http://www.omdbapi.com/?apikey=${apikey}&s=${srch}&type=movie`;
    axios.get(url).then((movies) => {
      if (movies.data.Search) {
        var results = [], no_results = 0;
        new Promise(function(resolve, reject) {
          var movieCount = movies.data.Search.length;
          movies.data.Search.forEach((movie, i) => {
            if (movie.Poster !== "N/A") {
              var img = new Image();
              img.onload = () => {
                if (img.width / img.height < 0.8 && img.height > 200) {
                  results.push(
                    <Movie movie={movie} key={i} srch={true} addMovie={Home.addMovie} />
                  );
                  no_results++;
                }
                movieCount--;
                if (!movieCount) {
                  resolve();
                }
              }
              img.src = movie.Poster;
            } else {
              movieCount--;
              if (!movieCount) {
                resolve();
              }
            }
          });
        }).then(() => {
          this.setState({results: results, no_results: no_results});
        });
      }
    }).catch((err) => {
      console.log('omdbapi err:', err);
    });
  }

  srch(e) {
    if (e.target.value === "") {
      this.setState({no_results: ""});
    } else {
      this.callOMDB(e.target.value);
    }
  }

  clearResults() {
    document.getElementById("srch-box").value = "";
    this.setState({no_results: ""});
  }

  addMovie(movie) {
    var newState = Object.assign({}, this.state);
    newState.items.push(movie);
    this.setState(newState);
    this.clearResults();
  }

  remMovie(imdbID) {
    console.log(imdbID);
  }

  render() {

    var results = [];
    if (this.state.no_results <= 0) {
      results = this.state.items.map((result, i) => {
        return (
          <Movie movie={result} key={i} srch={false} remMovie={this.remMovie} />
        );
      });
    }

    return (
      <div className="Home">
        <div className="home-nav">
          <i style={this.state.no_results ? null : {"display": "none"}}
            onClick={this.clearResults} className="fa fa-times-circle" aria-hidden="true"></i>
          <input id="srch-box" onChange={this.srch} type="text" placeholder="search..." />
          <div className="head-text">
            <h1>{this.state.no_results ? "Search Results" : "Favorite Movies"}</h1>
            <h1><a href="/login">William Cox</a></h1>
          </div>
        </div>
        <div className="line"></div>
        <div className="home-body">
          {this.state.no_results <= 0 ? (
            <SortableList items={results} onSortEnd={this.onSortEnd} />
          ) : (
            this.state.results
          )}
          {this.state.no_results > 1 ? (
            <h1 className="results-message">showing {this.state.no_results} results</h1>
          ) : null}
          {this.state.no_results === 1 ? (
            <h1 className="results-message">showing {this.state.no_results} result</h1>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Home;

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
