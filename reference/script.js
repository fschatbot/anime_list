
	let list = JSON.parse(localStorage.getItem('AnimeList')) || {};
	list = Object.keys(list).sort().reduce((obj, key) => { obj[key] = list[key];return obj;},{});
	if(!Object.isEmpty(list)){
		let max_length = Math.max(...Object.keys(list).map(a => a.length)) * 12;
		let append = document.querySelector('.list')
		let del_anime = document.querySelector('#Del_Anime')
		for(const key in list){
			text_or_link = list[key].link ? `<a href="${list[key].link}" target="_blank">${key.title()}</a>` : key.title();
			complete_check = list[key].finished ? 'checked' : '';
			generated_function = `toggle(this,'${key.replaceAll("'","\\'")}')`
			append.appendChild(createElm(`<div class="form-check"><input class="form-check-input" type="checkbox" onclick="${generated_function}" id="${key}" ${complete_check}><label class="form-check-label" for="${key}" style="font-size:20px;">${text_or_link}</label><input for="${key}" class="form-control space" value="${list[key].link}" onchange="change(this,\`${key}\`)" style="width:300px;display:inline;left:${max_length}px;position:sticky"></div>`))

			del_anime.append(createElm(`<option value="${key}">${key}</option>`))
			/* Previous attempt
			appen.appendChild(createElm(`<input type="checkbox" id="${key}" onclick="toggle(this,'${key.replace(/'/g,'\\\'')}')"${list[key].finished?' checked':''}>`))
			let a = list[key].link ? `<a href="${list[key].link}" target="_blank">${key}</a>` : key
			appen.appendChild(createElm(`<label for="${key}">${a}&nbsp&nbsp</label>`));
			appen.appendChild(createElm(`<input type="text" value="${list[key].link}" onchange="change(this,\`${key}\`)">`))
			appen.appendChild(createElm('<br>'))
			*/
		}
	}
	const change = (elem,Name) => {
		list[Name].link = elem.value;
		localStorage.setItem('AnimeList',JSON.stringify(list));
	}
	const toggle = (elem,Name) => {
		list[Name].finished = elem.checked;
		localStorage.setItem('AnimeList',JSON.stringify(list));
	}
	const add = () =>{
		link = document.querySelector('#Link').value ? document.querySelector('#Link').value : null
		list[document.querySelector('#Name').value] = {finished:false,link:document.querySelector('#Link').value}
		localStorage.setItem('AnimeList',JSON.stringify(list));
		location.reload()
	}
	const del = () =>{
		delete list[document.querySelector('#Delete').value];
		localStorage.setItem('AnimeList',JSON.stringify(list));
		location.reload();
	}