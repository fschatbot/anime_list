import { Fragment, Component } from "react";

class App extends Component {
	state = {
		anime_data: JSON.parse(localStorage.getItem("AnimeList")) || {},
	};
	render() {
		return (
			<Fragment>
				<h1 className="text-blue-600 text-xl"> Anime List </h1>
				<this.AnimeList />
			</Fragment>
		);
	}

	AnimeList = () => {
		let anime_data = this.state.anime_data;
		if (!anime_data) {
			return (
				<ul>
					<li key="nolist">There are no animes</li>
				</ul>
			);
		}
		return (
			<ul className="AnimeList">
				{Object.keys(anime_data).map((anime) => (
					<li key={anime} className={"ListItem " + (anime_data[anime].finished ? "finished" : "")}>
						<input type="checkbox" defaultChecked={anime_data[anime].finished}></input>
						<this.Labeling anime={anime} link={anime_data[anime].link} />
					</li>
				))}
			</ul>
		);
	};

	Labeling = ({ anime, link }) => {
		console.log(anime, link);
		if (link) {
			return (
				<a href={link} target="_blank" rel="noopener noreferrer">
					{anime}
				</a>
			);
		} else {
			return <label>{anime}</label>;
		}
	};

	update_anime_data = (Data) => {
		this.setState({
			anime_data: Data,
		});
		localStorage.setItem("AnimeList", JSON.stringify(Data));
	};
}

export default App;
