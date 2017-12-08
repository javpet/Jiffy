import React from "react";

class Gif extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loaded: false
		};
	}

	render() {
		// When the video is loaded we add a classname otherwise it
		return (
			<video
				className={`grid-item video ${this.state.loaded ? "loaded" : ""}`}
				autoPlay
				loop
				src={this.props.images.original.mp4}
				onLoadedData={() => this.setState({ loaded: true })}
			/>
		);
	}
}

export default Gif;
