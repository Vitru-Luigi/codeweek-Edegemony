function createActionBar(movie) {
	let actionWrapper = document.createElement('div');
	actionWrapper.classList.add('action__wrapper');

	let progressContainer = document.createElement('div');
	progressContainer.classList.add('progress__container');

	let percent = movie.vote_average;
	let percentOf100 = parseFloat(percent * 10);

	let progress = document.createElement('div');
	progress.classList.add('c100', 'progress', `p${percentOf100}`, 'small', 'center');

	let btnVote = document.createElement('button');
	btnVote.classList.add('btn-vote');
	btnVote.addEventListener('click', showVoteBar);
	let iconVote = document.createElement('i');
	iconVote.classList.add('fa', 'fa-star');
	let slidingInput = document.createElement('input');
	slidingInput.style.display = 'none';
	slidingInput.classList.add('input-vote');
	slidingInput.type = 'range';
	slidingInput.step = '5';
	slidingInput.value = 'range';
	slidingInput.dataset.movieId = movie.id;
	slidingInput.dataset.sectionId = 'movie';
	slidingInput.dataset.actionId = 'rating';
	slidingInput.dataset.movieTitle = movie.title || movie.name || movie.original_title || movie.original_name;
	slidingInput.addEventListener('change', onAddToActionClick);
	let btnLike = document.createElement('button');
	btnLike.classList.add('btn-like');
	btnLike.dataset.movieId = movie.id;
	btnLike.dataset.sectionId = 'movie';
	btnLike.dataset.actionId = 'favorite';
	btnLike.dataset.movieTitle = movie.title || movie.name || movie.original_title || movie.original_name;
	btnLike.addEventListener('click', onAddToActionClick);
	let iconLike = document.createElement('i');
	iconLike.classList.add('fa', 'fa-heart');
	iconLike.dataset.movieId = movie.id;
	iconLike.dataset.sectionId = 'movie';
	iconLike.dataset.actionId = 'favorite';
	iconLike.dataset.movieTitle = movie.title || movie.name || movie.original_title || movie.original_name;

	let btnWatchList = document.createElement('button');
	btnWatchList.classList.add('btn-watchList');
	btnWatchList.dataset.movieId = movie.id;
	btnWatchList.dataset.sectionId = 'movie';
	btnWatchList.dataset.actionId = 'watchlist';
	btnWatchList.dataset.movieTitle = movie.title || movie.name || movie.original_title || movie.original_name;
	btnWatchList.addEventListener('click', onAddToActionClick);
	let iconWatchList = document.createElement('i');
	iconWatchList.classList.add('fa', 'fa-ticket');
	iconWatchList.dataset.movieId = movie.id;
	iconWatchList.dataset.sectionId = 'movie';
	iconWatchList.dataset.actionId = 'watchlist';
	iconWatchList.dataset.movieTitle = movie.title || movie.name || movie.original_title || movie.original_name;

	let span = document.createElement('span');
	span.textContent = `${percentOf100}%`;

	let slice = document.createElement('div');
	slice.classList.add('slice');

	let bar = document.createElement('div');
	bar.classList.add('bar');

	let fill = document.createElement('div');
	fill.classList.add('fill');

	btnVote.appendChild(iconVote);
	btnLike.appendChild(iconLike);
	btnWatchList.appendChild(iconWatchList);

	slice.append(bar, fill);
	progress.append(span, slice);
	progressContainer.appendChild(progress);
	actionWrapper.append(progressContainer, btnLike, btnWatchList, btnVote, slidingInput);
	function showVoteBar() {
		slidingInput.style.display === 'block' ? (slidingInput.style.display = 'none') : (slidingInput.style.display = 'block');
		setTimeout(() => {
			slidingInput.style.display = 'none';
		}, 12000);
	}
	return actionWrapper;
}

function createPagination(pages, nodeSection, mediaType = 'movie') {
	let pagesWrap = nodeSection.querySelector('.carousel__wrapper--pagination');
	let pageUl = document.createElement('ul');
	for (let i = 0; i < pages; i++) {
		let pageLi = document.createElement('li');
		pageLi.textContent = `${i + 1}`;
		pageLi.dataset.sectionId = nodeSection.id;
		pageLi.dataset.pageNum = i + 1;
		pageLi.dataset.mediaType = mediaType;
		pageLi.onclick = onclickPagination;
		pageUl.appendChild(pageLi);
	}
	pagesWrap.appendChild(pageUl);
}

const onclickPagination = async (evt) => {
	evt.preventDefault();
	const sectionId = evt.target.dataset.sectionId;
	const pageNum = evt.target.dataset.pageNum;
	const mediaType = evt.target.dataset.mediaType;

	switch (sectionId) {
		case 'popular':
			console.log('popular');
			await getPopularMovies(false, false, mediaType, 0, pageNum);
			renderCarousel(stateMovies[sectionNameId[0]], nodeSectionId[0]);
			break;
		case 'top_rated':
			console.log('top_rated');
			await getTop_ratedMovies(false, false, mediaType, 1, pageNum);
			renderCarousel(stateMovies[sectionNameId[1]], nodeSectionId[1]);
			break;
		case 'now_playing':
			console.log('now_playing');
			await getNow_playingMovies(false, false, mediaType, 2, pageNum);
			renderCarousel(stateMovies[sectionNameId[2]], nodeSectionId[2]);
			break;
		case 'upcoming':
			console.log('upcoming');
			await getUpcomingMovies(false, false, mediaType, 3, pageNum);
			renderCarousel(stateMovies[sectionNameId[3]], nodeSectionId[3]);
			break;
		default:
	}
};

function onGetSessionBtnClick() {
	const { api_key, base_url } = state.config;
	fetch(`${base_url}/authentication/session/new?api_key=${api_key}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			request_token: requestToken,
		}),
	})
		.then((r) => {
			console.log(r);
			return r.json();
		})
		.then((data) => {
			sessionId = data.session_id;
			return fetch(`${base_url}/account?api_key=${api_key}&session_id=${sessionId}`);
		})
		.then((r) => {
			console.log(r);
			return r.json();
		})
		.then((data) => {
			console.log(data);

			let accountLng = `${data.iso_639_1}-${data.iso_3166_1}`;
			console.log('lingua Account', accountLng);
			accountId = data.id;
			accountName = data.name;
			accountNick = data.username;
			accountImg = data.avatar.tmdb.avatar_path;
			createUserCard(accountName, accountNick, accountImg, accountId, sessionId, requestToken);
		});
}

function onAddToActionClick(e) {
	e.preventDefault();

	const vote = e.target.value / 10;
	console.log(vote);
	const movieId = e.target.dataset.movieId;
	const movieTitle = e.target.dataset.movieTitle;
	const sectionID = e.target.dataset.sectionId;
	const btnAction = e.target.dataset.actionId;
	const shouldAdd = window.confirm(`Are you sure you want to add the ${sectionID} show "${movieTitle}" to your ${btnAction}?`);

	let bodyWatchlist = JSON.stringify({
		media_type: sectionID,
		media_id: parseInt(movieId, 10),
		watchlist: true,
	});

	let bodyFavourite = JSON.stringify({
		media_type: sectionID,
		media_id: parseInt(movieId, 10),
		favorite: true,
	});

	let bodyRating = JSON.stringify({
		value: +e.target.value / 10,
	});

	let bodyAction = (btnAction === 'watchlist' && bodyWatchlist) || (btnAction === 'favorite' && bodyFavourite) || (btnAction === 'rating' && bodyRating);

	console.log(bodyAction);

	const { api_key, base_url } = state.config;

	const urlAction = btnAction === 'rating' ? `${base_url}/${sectionID}/${movieId}/${btnAction}?api_key=${api_key}&session_id=${sessionId}` : `${base_url}/account/${accountId}/${btnAction}?api_key=${api_key}&session_id=${sessionId}`;

	if (shouldAdd) {
		fetch(urlAction, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: bodyAction,
		})
			.then((r) => r.json())
			.then((data) => {
				console.log(data);
			});
	}
}

function createUserCard(userName, userNick, userImg, userID, sessionID, reqToken) {
	const userCardWrapper = document.createElement('div');
	const userContentWrapper = document.createElement('div');
	const userTitleWrapper = document.createElement('div');
	const timeLeftWrapper = document.createElement('div');
	timeLeftWrapper.classList.add('time-badge');
	userCardWrapper.classList.add('user-card');
	const image = document.createElement('img');
	image.src = `https://www.themoviedb.org/t/p/w32_and_h32_face${userImg}`;
	const name = document.createElement('h2');
	name.textContent = userName;
	const nickname = document.createElement('h4');
	nickname.textContent = userNick;
	const id = document.createElement('p');
	id.textContent = `ID ${userID}`;
	const sessionId = document.createElement('p');
	sessionId.textContent = `SESSION ID ${sessionID}`;
	const token = document.createElement('p');
	token.textContent = `REQ TOKEN ${reqToken}`;
	userTitleWrapper.appendChild(image);
	userTitleWrapper.appendChild(name);
	userContentWrapper.appendChild(nickname);
	userContentWrapper.appendChild(id);
	userContentWrapper.appendChild(sessionId);
	userContentWrapper.appendChild(token);
	userCardWrapper.appendChild(userTitleWrapper);
	userCardWrapper.appendChild(userContentWrapper);
	authBlock.appendChild(userCardWrapper);
	userCardWrapper.classList.add('movie-form--is-visible');

	let t = 60;
	const countdown = (timer) => {
		if (timer === t) {
			timeLeftWrapper.innerHTML = `TIME LEFT : &nbsp <span>${t}</span> &nbsp mins`;
		}
		setTimeout(() => {
			t--;
			if (t <= 0) {
				return (timeLeftWrapper.textContent = `TIME OVER`);
			} else {
				countdown(t);
				timeLeftWrapper.innerHTML = `TIME LEFT : &nbsp <span> ${t} </span> &nbsp mins`;
			}
		}, timer * 1000);
	};
	countdown(60);

	userCardWrapper.appendChild(timeLeftWrapper);
}

const TOAST = document.querySelector('.toast');

const JUMBOTRON = document.querySelector('.jumbotron__section');

const POPULAR_MOVIES = document.querySelector('#popular');
const TOP_RATED_MOVIES = document.querySelector('#top_rated');
const NOW_PLAYING_MOVIES = document.querySelector('#now_playing');
const UPCOMING_MOVIES = document.querySelector('#upcoming');

const ROUTELINK = ['home', 'popular', 'top_rated', 'now_playing', 'upcoming'];

const authBlock = document.querySelector('.auth-block');
const getTokenBtn = authBlock.querySelector('.auth-block__get-token');
const getSessionBtn = authBlock.querySelector('.auth-block__get-session');
const linkAnchor = authBlock.querySelector('.auth-block__link');

let requestToken = null,
	sessionId = null,
	accountId = null,
	userName = null,
	userNick = null,
	userImg = null,
	ID = 0;

const nodeSectionId = [POPULAR_MOVIES, TOP_RATED_MOVIES, NOW_PLAYING_MOVIES, UPCOMING_MOVIES];

const sectionNameId = ['popular', 'top_rated', 'now_playing', 'upcoming'];

const navLink = document.querySelectorAll('li');

navLink.forEach((el) => {
	el.addEventListener('click', showMain);
});

console.log(navigator.language);

const state = {
	config: {
		api_key: '184ac615bbddb56006c71f577cc1b1b1',
		base_url: 'https://api.themoviedb.org/3',
		language: navigator.language,
	},
};

const stateImages = {
	popular: null,
	top_rated: null,
	now_playing: null,
	upcoming: null,
};

const stateMovies = {
	popular: null,
	top_rated: null,
	now_playing: null,
	upcoming: null,
};

function showMain(e) {
	const currentMain = document.querySelector('.is_visible');
	console.log(e.target.dataset.linkid);
	console.log(currentMain);
	const newMain = document.querySelector(`#${e.target.dataset.linkid}`);
	console.log(newMain);

	currentMain.classList.toggle('is_visible');
	setTimeout(() => {
		newMain.classList.toggle('is_visible');
	}, 150);
}

function getUrl(isConfig = false, isSession = false, pathName, path, page = 1, mediaType = 'movie') {
	const { api_key, base_url, language } = state.config;

	return isConfig ? `${base_url}/${pathName}?api_key=${api_key}&page=${page}` : `${base_url}/${pathName}/${path}?api_key=${api_key}&language=${language}&page=${page}`;
}

function getImageUrl(imgPath, backdrop) {
	const secure_base_url = stateImages[sectionNameId[0]].secure_base_url;
	const poster_sizes = stateImages[sectionNameId[0]].poster_sizes[3];
	const backdrop_sizes = stateImages[sectionNameId[0]].backdrop_sizes[3];

	if (backdrop) {
		return `${secure_base_url}${backdrop_sizes}${imgPath}`;
	} else {
		return `${secure_base_url}${poster_sizes}${imgPath}`;
	}
}

async function getData(url) {
	try {
		const response = await fetch(url);
		const result = await response.json();

		if (!response.ok) {
			throw result;
		}
		return result;
	} catch (errorMessage) {
		console.error(errorMessage);
	}
}

async function getGuestSession() {
	const guestSessionUrl = getUrl(false, false, 'authentication', 'guest_session/new');

	const result = await getData(guestSessionUrl);

	return result;
}

async function getConfiguration() {
	const configurationUrl = getUrl(true, false, 'configuration');
	const result = await getData(configurationUrl);
	stateImages[sectionNameId[0]] = result.images;

	return result;
}

async function getPopularMovies(isConfig, isSession, mediaType, ID, page = 1) {
	const popularMoviesURL = getUrl(isConfig, isSession, mediaType, sectionNameId[ID], page);
	console.log(popularMoviesURL, 'popularMoviesURL');
	const rawResponse = await getData(popularMoviesURL);
	stateMovies[sectionNameId[ID]] = rawResponse.results;
	stateMovies[sectionNameId[ID]].pages = rawResponse.total_pages;
	return rawResponse;
}

async function getTop_ratedMovies(isConfig, isSession, mediaType, ID, page = 1) {
	const topRatedMoviesURL = getUrl(isConfig, isSession, mediaType, sectionNameId[ID], page);
	console.log(topRatedMoviesURL, 'topRatedMoviesURL');
	const rawResponse = await getData(topRatedMoviesURL);
	stateMovies[sectionNameId[ID]] = rawResponse.results;
	stateMovies[sectionNameId[ID]].pages = rawResponse.total_pages;
	return rawResponse;
}

async function getNow_playingMovies(isConfig, isSession, mediaType, ID, page = 1) {
	const now_playingMoviesURL = getUrl(isConfig, isSession, mediaType, sectionNameId[ID], page);
	console.log(now_playingMoviesURL, 'Now_playingMoviesURL');
	const rawResponse = await getData(now_playingMoviesURL);
	stateMovies[sectionNameId[ID]] = rawResponse.results;
	stateMovies[sectionNameId[ID]].pages = rawResponse.total_pages;

	return rawResponse;
}

async function getUpcomingMovies(isConfig, isSession, mediaType, ID, page = 1) {
	const upcomingMoviesURL = getUrl(isConfig, isSession, mediaType, sectionNameId[ID], page);
	console.log(upcomingMoviesURL, 'upcomingMoviesURL');
	const rawResponse = await getData(upcomingMoviesURL);
	stateMovies[sectionNameId[ID]] = rawResponse.results;
	stateMovies[sectionNameId[ID]].pages = rawResponse.total_pages;
	return rawResponse;
}

function onGetTokenBtnClick() {
	const { api_key, base_url } = state.config;
	fetch(`${base_url}/authentication/token/new?api_key=${api_key}`)
		.then((r) => r.json())
		.then((data) => {
			// console.log(data);
			requestToken = data.request_token;
			linkAnchor.href = `https://www.themoviedb.org/authenticate/${data.request_token}/allow`;
			linkAnchor.classList.add('auth-block__link--is-visible');
			getSessionBtn.disabled = false;
		});
}

async function handleSession() {
	const sessionData = localStorage.getItem('mdb_session');
	console.log(sessionData);

	if (!sessionData) {
		const newSessionData = await getGuestSession();

		if (newSessionData) {
			const sessionDataString = JSON.stringify(newSessionData);
			console.log(sessionDataString);
			console.log(sessionDataString.guest_session_id);

			localStorage.setItem('mdb_session', sessionDataString);

			showToast('Hey! Adesso sei registrato come guest');

			return true;
		}

		return false;
	} else {
		const parsedSessionData = JSON.parse(sessionData);

		const expiresDate = new Date(parsedSessionData.expires_at).getTime();
		const nowDate = new Date().getTime();

		if (expiresDate < nowDate) {
			localStorage.removeItem('mdb_session');
			await handleSession();

			return true;
		}
		return true;
	}
}

function showToast(text) {
	TOAST.textContent = text;
	TOAST.classList.toggle('toast__is-hidden');

	setTimeout(() => {
		TOAST.classList.toggle('toast__is-hidden');
	}, 4000);
}

function getMovieCard(imgURL, movie) {
	const carWrapCard = document.createElement('div');
	carWrapCard.classList.add('carousel__wrapper-card');
	const flipCardContainer = document.createElement('div');
	flipCardContainer.classList.add('flip-card-container');
	const flipCard = document.createElement('div');
	flipCard.classList.add('flip-card');
	flipCard.dataset.movieId = movie.id;
	flipCard.onmouseover = (evt) => {
		evt.preventDefault();
		onClickRenderOnJumbotron(movie.id);
	};

	const carImgInBg = document.createElement('div');
	carImgInBg.style.backgroundImage = `url(${imgURL})`;
	carImgInBg.classList.add('card-img');
	const flipCardFront = document.createElement('div');
	flipCardFront.classList.add('flip-card-front');
	const flipCardBack = document.createElement('div');
	flipCardBack.classList.add('flip-card-back');
	const description = document.createElement('p');
	description.textContent = movie.overview;
	const title = document.createElement('h6');
	title.textContent = movie.title || movie.name || movie.original_title || movie.original_name;

	let actionWrapper = createActionBar(movie);
	flipCardBack.append(title, description);
	flipCardFront.appendChild(carImgInBg);
	flipCard.appendChild(flipCardFront);
	flipCard.appendChild(flipCardBack);
	flipCardContainer.appendChild(flipCard);
	carWrapCard.appendChild(flipCardContainer);
	carWrapCard.appendChild(actionWrapper);

	return carWrapCard;
}

function renderOnJumbotron(movie, cast, crew) {
	JUMBOTRON.innerHTML = '';

	const urlBackdrop = getImageUrl(movie.backdrop_path, true);

	const jumbotron = document.createElement('div');
	jumbotron.classList.add('jumbotron');
	const jumbotronContent = document.createElement('div');
	jumbotronContent.classList.add('jumbotron__content');
	const jumbotronTitle = document.createElement('h3');
	jumbotronTitle.classList.add('jumbotron__content-title');
	jumbotronTitle.textContent = movie.title;

	jumbotron.style.backgroundImage = `url(${urlBackdrop})`;
	const h4SpanWrap = document.createElement('h4');
	const overview = document.createElement('p');
	overview.textContent = movie.overview;

	movie.genres.forEach((el) => {
		let span = document.createElement('span');
		span.textContent = el.name;
		h4SpanWrap.append(span);
	});

	const btnWrapper = document.createElement('div');
	btnWrapper.classList.add('jumbotron__btn-wrapper');
	const btnLink = document.createElement('a');
	const icon = document.createElement('i');
	icon.classList.add('fa', 'fa-plus');

	btnLink.appendChild(icon);
	btnWrapper.appendChild(btnLink);

	jumbotronContent.append(jumbotronTitle, h4SpanWrap, overview, btnWrapper);
	jumbotron.appendChild(jumbotronContent);
	JUMBOTRON.appendChild(jumbotron);
}

function getMovieTvShowbyIdAccountStatesUrl(id, mediaType = 'movie') {
	const { api_key, base_url } = state.config;
	return `${base_url}/${mediaType}/${id}/account_states?api_key=${api_key}&language=it-IT&session_id=${sessionId}`;
}

function getMovieTvShowbyIdKeywordsUrl(id, mediaType = 'movie') {
	const { api_key, base_url } = state.config;
	return `${base_url}/${mediaType}/${id}/keywords?api_key=${api_key}&language=it-IT`;
}

function getMovieTvShowbyIdSocialUrl(id, mediaType = 'movie') {
	const { api_key, base_url } = state.config;
	return `${base_url}/${mediaType}/${id}/external_ids?api_key=${api_key}&language=it-IT`;
}

function getMovieTvShowbyIdVideosUrl(id, mediaType = 'movie') {
	const { api_key, base_url } = state.config;
	return `${base_url}/${mediaType}/${id}/videos?api_key=${api_key}&language=it-IT`;
}

function getMovieTvShowbyIdDetailsUrl(id, mediaType = 'movie') {
	const { api_key, base_url } = state.config;
	return `${base_url}/${mediaType}/${id}?api_key=${api_key}&language=it-IT`;
}

function getMovieTvShowbyIdCreditsUrl(id, mediaType = 'movie') {
	const { api_key, base_url } = state.config;
	return `${base_url}/${mediaType}/${id}/credits?api_key=${api_key}&language=it-IT`;
}

async function onClickRenderOnJumbotron(movieId, mediaType) {
	const urlDetails = getMovieTvShowbyIdDetailsUrl(movieId);
	const urlCredits = getMovieTvShowbyIdCreditsUrl(movieId);
	const urlVideos = getMovieTvShowbyIdVideosUrl(movieId);
	const urlSocial = getMovieTvShowbyIdSocialUrl(movieId);
	const urlKeywords = getMovieTvShowbyIdKeywordsUrl(movieId);
	const urlAccountStates = getMovieTvShowbyIdAccountStatesUrl(movieId);
	console.log(urlVideos);
	console.log(urlSocial);
	console.log(urlKeywords);
	console.log(urlAccountStates);

	let urlDetailsResponse = await getData(urlDetails);
	let urlCreditsResponse = await getData(urlCredits);
	let urlVideosResponse = await getData(urlVideos);
	let urlSocialResponse = await getData(urlSocial);
	let urlKeywordsResponse = await getData(urlKeywords);
	let urlAccountStatesResponse = await getData(urlAccountStates);
	console.log(urlVideosResponse);
	console.log(urlKeywordsResponse);
	console.log(urlSocialResponse);
	console.log(urlAccountStatesResponse);

	renderOnJumbotron(urlDetailsResponse, urlCreditsResponse.cast, urlCreditsResponse.crew);
	// return response;
}

function renderCarousel(list, sectionNode) {
	const cardWrapper = sectionNode.querySelector('.carousel__wrapper--cards');
	cardWrapper.innerHTML = '';
	list.forEach((item) => {
		const imgURL = getImageUrl(item.poster_path);

		const movieCard = getMovieCard(imgURL, item);

		const cardWrapper = sectionNode.querySelector('.carousel__wrapper--cards');

		cardWrapper.appendChild(movieCard);
	});
}

function handleHTMLMounted() {
	Promise.all([handleSession(), getConfiguration(), getPopularMovies(false, false, 'movie', 0), getTop_ratedMovies(false, false, 'movie', 1), getNow_playingMovies(false, false, 'movie', 2), getUpcomingMovies(false, false, 'movie', 3)]).then(() => {
		sectionNameId.forEach((e, i) => {
			createPagination(stateMovies[sectionNameId[i]].pages, nodeSectionId[i]);
			renderCarousel(stateMovies[sectionNameId[i]], nodeSectionId[i]);
		});
		onClickRenderOnJumbotron(stateMovies[sectionNameId[2]][0].id);
	});
}

document.addEventListener('DOMContentLoaded', handleHTMLMounted, {
	once: true,
});

getTokenBtn.addEventListener('click', onGetTokenBtnClick);
getSessionBtn.addEventListener('click', onGetSessionBtnClick);
