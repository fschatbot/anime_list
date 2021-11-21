import { Fragment, Component } from "react";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import SendNotification from "./notify";

class App extends Component {
	state = {
		anime_data: JSON.parse(localStorage.getItem("AnimeList")) || {},
		editing: null,
	};
	render() {
		return (
			<Fragment>
				<this.AnimeList />
				<this.AddAnime />
			</Fragment>
		);
	}

	AnimeList = () => {
		let anime_data = this.state.anime_data;
		// Sort Data
		anime_data = Object.keys(anime_data)
			.sort()
			.reduce((obj, key) => {
				obj[key] = anime_data[key];
				return obj;
			}, {});

		if (!anime_data) {
			return (
				<div className="container">
					<h1 className="text-4xl">List Of Anime</h1>
					<ul>
						<li key="nolist">There are no animes</li>
					</ul>
				</div>
			);
		}
		return (
			<div className="container">
				<h1 className="text-4xl">List Of Anime</h1>
				<ul className="AnimeList">
					{Object.keys(anime_data).map((anime) => (
						<li
							key={anime}
							className={"ListItem group " + (anime_data[anime].finished ? "finished" : "")}>
							<input type="checkbox" defaultChecked={anime_data[anime].finished}></input>
							<this.Labeling anime={anime} link={anime_data[anime].link} />
							<button
								className={this.IsEditting(anime) + " group-hover:scale-100 Edit"}
								onClick={() => this.EditAnime(anime)}>
								<AiOutlineEdit />
							</button>
							<div className={"EditContainer " + this.IsEditting(anime)}>
								<input
									type="input"
									placeholder="Enter Anime Link..."
									defaultValue={anime_data[anime].link}
									className="Link"
									onKeyUp={this.ChangeLink(anime)}></input>
								<input
									type="input"
									placeholder="Enter New Name..."
									onKeyUp={this.ChangeName(anime)}></input>
								<button className="Delete" onClick={() => this.DelAnime(anime)}>
									<AiFillDelete />
								</button>
							</div>
						</li>
					))}
				</ul>
			</div>
		);
	};

	Labeling = ({ anime, link }) => {
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

	DelAnime = (anime) => {
		const UserInput = window.confirm("Are you sure you want to delete " + anime + "?");
		if (UserInput) {
			let anime_data = this.state.anime_data;
			delete anime_data[anime];
			this.SetAnimeData(anime_data);
			this.setState({ editing: null });
			SendNotification("Deleted " + anime);
		}
		SendNotification("Cancelled deletion of " + anime);
	};

	EditAnime = (anime) => {
		if (this.state.editing === anime) {
			this.setState({ editing: null });
		} else {
			this.setState({ editing: anime });
		}
	};

	IsEditting = (anime) => {
		if (this.state.editing === anime) {
			return "scale-100";
		}
		return "scale-0";
	};

	ChangeName = (anime) => (e) => {
		if (e.key === "Enter") {
			let anime_data = this.state.anime_data;
			let data = anime_data[anime];
			delete anime_data[anime];
			anime_data[e.target.value] = data;
			this.SetAnimeData(anime_data);
			SendNotification("Renamed " + anime + " to " + e.target.value);
		}
	};

	ChangeLink = (anime) => (e) => {
		if (e.key === "Enter") {
			let anime_data = this.state.anime_data;
			const URLregx = /^(ftp|http|https):\/\/[^ "]+$/;
			if (URLregx.test(e.target.value)) {
				anime_data[anime].link = e.target.value;
				this.SetAnimeData(anime_data);
				SendNotification("Changed link of " + anime + " to " + e.target.value);
			} else {
				e.target.value = anime_data[anime].link;
				SendNotification("Invalid URL");
			}
		}
	};

	AddAnime = () => {
		return (
			<div className="container AddAnimes">
				<h1 className="text-4xl">Add Anime</h1>
				<label htmlFor="AnimeName">Anime Name:</label>
				<input type="input" placeholder="Enter Anime Name..." id="AnimeName"></input>
				<label htmlFor="AnimeLink">Anime Link:</label>
				<input type="input" placeholder="Enter Anime Link..." id="AnimeLink"></input>
				<button className="Add" onClick={this.AddAnimeSubmit}>
					Add
				</button>
			</div>
		);
	};

	AddAnimeSubmit = () => {
		let anime_data = this.state.anime_data;
		let anime_name = document.getElementById("AnimeName").value;
		let anime_link = document.getElementById("AnimeLink").value;
		if (anime_name && anime_link) {
			if (anime_data[anime_name]) {
				anime_data[anime_name].link = anime_link;
				SendNotification("Updated " + anime_name + " link to " + anime_link);
			} else {
				anime_data[anime_name] = { link: anime_link, finished: false };
				SendNotification("Added " + anime_name + " to list!");
			}
			this.SetAnimeData(anime_data);
		} else {
			SendNotification("Invalid Input");
		}
	};

	SetAnimeData = (data) => {
		data = Object.keys(data)
			.sort()
			.reduce((obj, key) => {
				obj[key] = data[key];
				return obj;
			}, {});
		this.setState({
			anime_data: data,
		});
		localStorage.setItem("AnimeList", JSON.stringify(data));
	};
}

export default App;
