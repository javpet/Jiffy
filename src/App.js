import React, { Component } from "react";
import loader from "./images/loader.svg";
import closeButton from "./images/close-icon.svg";

import Gif from "./GIF.js";

const randomChoice = arr => {
	const randIndex = Math.floor(Math.random() * arr.length);
	return arr[randIndex];
};

const Header = props => {
	return (
		<div className="header grid">
			{props.hasResults ? (
				<button onClick={props.clearSearch}>
					<img src={closeButton} />
				</button>
			) : (
				<h1 className="title">Jiffy</h1>
			)}
		</div>
	);
};

const UserHint = props => {
	return (
		<div className="user-hint">
			{props.loading ? <img src={loader} className="block mx-auto" /> : props.hintText}
		</div>
	);
};

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchTerm: "",
			hintText: "",
			gifs: null,
			gifs: [],
			loading: false
		};
	}

	searchGiphy = searchTerm => {
		this.setState({
			loading: true
		});
		try {
			// Here we use the await keyword to wait for the response to come back
			fetch(
				`https://api.giphy.com/v1/gifs/search?api_key=KgK0rtsfIyvT5AiTpwN8RzaUkNahJaU0&q=${
					searchTerm
				}&limit=25&offset=0&rating=G&lang=en`
			)
				.then(response => response.json())
				.then(data => {
					if (!data.data.length) {
						throw `Nothing found for ${searchTerm}`;
					}
					const randomGif = randomChoice(data.data);
					this.setState({
						gif: randomGif,
						gifs: [...this.state.gifs, randomGif]
					});
					// We turn off the loading spinner
					this.setState({ loading: false, hintText: `Hit enter to see more ${searchTerm}` });
				})
				.catch(error => {
					this.setState({
						hintText: "Nothing found 🤔, please try again!",
						loading: false
					});
				});
		} catch (error) {
			console.log(error);
			this.setState({
				hintText: "Nothing found :(, try a new search!",
				loading: false
			});
		}
	};

	handleChange(event) {
		const value = event.target.value;
		this.setState({
			searchTerm: value,
			hintText: value.length > 2 && `Hit enter to search ${value}`
		});
	}

	handleKeyPress(event) {
		const value = event.target.value;
		if (value.length > 2 && event.key === "Enter") {
			this.searchGiphy(value);
		}
	}

	// Clearing our search
	clearSearch() {
		this.setState({
			searchTerm: "",
			hintText: "",
			gifs: []
		});
		// Focusing the cursor back to the input
		this.refs.input.focus();
	}

	render() {
		const searchTerm = this.state.searchTerm;
		const hasResults = this.state.gifs.length;
		return (
			<div className="page">
				<Header clearSearch={() => this.clearSearch()} hasResults={hasResults} />

				<div className="search grid">
					{this.state.gifs.map(gif => {
						// We spread all the props to the GIF component
						return <Gif key={gif.id} {...gif} />;
					})}
					<input
						onKeyPress={event => this.handleKeyPress(event)}
						onChange={event => this.handleChange(event)}
						className="input grid-item"
						placeholder="Type something"
						value={searchTerm}
						ref="input"
					/>
				</div>
				<UserHint {...this.state} />
			</div>
		);
	}
}

export default App;
