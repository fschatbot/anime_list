import { Fragment, Component } from "react";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import { VscSearch } from "react-icons/vsc";
import SendNotification, { IsURL } from "./notify";
import { Toaster } from "react-hot-toast";

class App extends Component {
	state = {
		anime_data: JSON.parse(localStorage.getItem("AnimeList")) || {},
		editing: null,
		search: "",
	};
	render() {
		return (
			<Fragment>
				<this.AnimeList />
				<this.AddAnime />
				<Toaster position="top-right" />
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

		if (JSON.stringify(anime_data) === JSON.stringify({})) {
			return (
				<div className="container">
					<h1 className="text-4xl">
						List Of Anime <sub>(0)</sub>
					</h1>
					<ul>
						<li key="nolist" className="ListItem">
							<label>No Current Anime (Add Some Below)</label>
						</li>
					</ul>
				</div>
			);
		}
		return (
			<div className="container">
				<h1 className="text-4xl">
					List Of Anime <sub>({Object.keys(anime_data).length})</sub>
				</h1>
				<this.SearchContainer />

				<ul className="AnimeList">
					{Object.keys(anime_data).map((anime) => (
						<li
							key={anime}
							className={
								"ListItem group " +
								(anime_data[anime].finished ? "finished " : "") +
								this.IsSearched(anime)
							}>
							<input
								type="checkbox"
								defaultChecked={anime_data[anime].finished}
								onChange={this.toggleAnime(anime)}></input>
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

	SearchContainer = () => {
		return (
			<div className={"SearchContainer" + this.IsNoResults()}>
				<div className="SearchBox">
					<input
						placeholder="Search..."
						className="SearchBar group"
						id="SearchBar"
						onKeyUp={(e) => this.setState({ search: e.target.value })}
					/>
					<button
						className="SearchSubmit"
						onClick={(e) => this.setState({ search: document.getElementById("SearchBar").value })}>
						<VscSearch size="20" />
					</button>
				</div>
				<span className="Error">Sorry There Are No Results</span>
			</div>
		);
	};

	IsSearched = (anime) => {
		let searchTerm = this.state.search;
		if (searchTerm === "") {
			return "";
		} else if (anime.toLowerCase().includes(searchTerm.toLowerCase())) {
			return "";
		} else if (
			searchTerm.replace(/[^A-Z]/, "") === searchTerm &&
			anime.replace(/[^A-Z]/g, "").includes(searchTerm.replace(/[^A-Z]/g, ""))
		) {
			// Remove all lowercase letters and then compare
			return "";
		} else {
			return "Hidden";
		}
	};

	IsNoResults = () => {
		if (this.state.search === "") return "";

		let AnimeNames = Object.keys(this.state.anime_data);
		let Results = AnimeNames.filter((anime) => !this.IsSearched(anime));
		return Results.length === 0 ? " NoResults" : "";
	};

	DelAnime = (anime) => {
		const UserInput = window.confirm("Are you sure you want to delete " + anime + "?");
		if (UserInput) {
			let anime_data = this.state.anime_data;
			delete anime_data[anime];
			this.SetAnimeData(anime_data);
			this.setState({ editing: null });
			SendNotification("Deleted " + anime);
		} else {
			SendNotification("Cancelled deletion of " + anime);
		}
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
			SendNotification(`Renamed "${anime}" to "${e.target.value}"`);
		}
	};

	ChangeLink = (anime) => (e) => {
		if (e.key === "Enter") {
			let anime_data = this.state.anime_data;
			if (IsURL(e.target.value)) {
				anime_data[anime].link = e.target.value;
				this.SetAnimeData(anime_data);
				SendNotification("Updated link of " + anime);
			} else {
				e.target.value = anime_data[anime].link;
				SendNotification("Invalid URL", "error");
			}
		}
	};

	toggleAnime = (anime) => (e) => {
		let anime_data = this.state.anime_data;
		anime_data[anime].finished = e.target.checked;
		this.SetAnimeData(anime_data);
		SendNotification(anime + " is now " + (e.target.checked ? "finished" : "unfinished"));
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
		if (anime_name && !anime_link) {
			anime_data[anime_name] = { link: "", finished: false };
			this.SetAnimeData(anime_data);
			SendNotification("Added " + anime_name + "!");
		} else if (anime_name && anime_link) {
			if (IsURL(anime_link)) {
				anime_data[anime_name] = { link: anime_link, finished: false };
				this.SetAnimeData(anime_data);
				SendNotification("Added " + anime_name + " with link!");
			} else {
				SendNotification("Invalid URL", "error");
			}
		} else {
			SendNotification("Invalid Input", "error");
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
