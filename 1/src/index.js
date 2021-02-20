const SEARCH = document.querySelector('form'),
	HOME = document.querySelector('.home'),
	ARTISTDETAIL = document.querySelector('.artistDetail'),
	ALBUMDETAIL = document.querySelector('.albumDetail'),
	SEARCHTAB = document.querySelector('.search'),
	NAVBAR = document.querySelector('.search'),
	FAVORITE = document.querySelector('.favorite'),
	LIBRARY = document.querySelector('.library'),
	CART = document.querySelector('.cart'),
	PAID = document.querySelector('.paid'),
	BTNPAY = document.querySelector('.btn-pay'),
	NAVLINK = document.querySelector('.navlink').querySelectorAll('li'),
	ROUTELINK = ['home', 'search', 'artistDetail', 'albumDetail', 'cart', 'library', 'favorite'];

NAVLINK.forEach((el) => {
	el.addEventListener('click', showMain);
});

let previousSection = '';

function millisToMinutesAndSeconds(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function goBack() {
	const currentMain = document.querySelector('.is_visible');
	let newMain;

	if (previousSection.includes('search')) {
		newMain = document.querySelector(`.search`);
	} else if (previousSection.includes('home')) {
		newMain = document.querySelector(`.home`);
	} else {
		newMain = document.querySelector(`.favorite`);
	}

	if (currentMain === newMain) {
		null;
	} else {
		currentMain.classList.toggle('is_visible');
		newMain.classList.toggle('is_visible');
	}
}

function goBackToHome() {
	const currentMain = document.querySelector('.is_visible');
	let newMain;
	newMain = document.querySelector(`.home`);
	currentMain.classList.toggle('is_visible');
	newMain.classList.toggle('is_visible');
}

function goBackToAlbum() {
	const currentMain = document.querySelector('.is_visible');

	const newMain = document.querySelector(`.artistDetail`);

	if (currentMain === newMain) {
		null;
	} else {
		currentMain.classList.toggle('is_visible');
		newMain.classList.toggle('is_visible');
	}
}

function showMainBySectionName(sectionName) {
	const currentMain = document.querySelector('.is_visible');

	const newMain = document.querySelector(`.${sectionName}`);
	if (currentMain === newMain) {
		null;
	} else {
		currentMain.classList.toggle('is_visible');
		setTimeout(() => {
			newMain.classList.toggle('is_visible');
		}, 150);
	}
}

function showMain(e) {
	const currentMain = document.querySelector('.is_visible');

	const newMain = document.querySelector(`.${e.target.dataset.linkid}`);
	if (currentMain === newMain) {
		null;
	} else {
		currentMain.classList.toggle('is_visible');
		setTimeout(() => {
			newMain.classList.toggle('is_visible');
		}, 150);
	}
}

function showSearch() {
	const currentMain = document.querySelector('.is_visible');
	if (currentMain.classList[0] === 'search') {
		null;
	} else {
		const newMain = document.querySelector('.search');
		currentMain.classList.toggle('is_visible');
		setTimeout(() => {
			newMain.classList.toggle('is_visible');
		}, 150);
	}
}

function showLibrary() {
	const currentMain = document.querySelector('.is_visible');
	const newMain = document.querySelector('.library');
	if (currentMain === newMain) {
		null;
	} else {
		currentMain.classList.toggle('is_visible');
		setTimeout(() => {
			newMain.classList.toggle('is_visible');
		}, 150);
	}
}

const state = {
	config: {
		api_key: '523532',
		api_token: 'BDBAB',
		base_url: 'https://theaudiodb.com/api/v1/json',
		language: navigator.language,
	},
};

const pathName = ['search', 'discography', 'album', 'artist', 'track', 'searchAlbum'];

let artistState = [],
	homeState = [],
	favoriteState = [],
	libraryState = [],
	cartState = [],
	paidState = [];

const artistName = [
	'Litfiba',
	'Pooh',
	'Eros_Ramazzotti',
	'Mina',
	'Laura_pausini',
	'Lucio_Battisti',
	'Gianni_Morandi',
	'Lucio_Dalla',
	'Negrita',
	'99_posse',
	'elisa',
	"gigi_d'alessio",
	'883',
	'subsonica',
	'afterhours',
	'marlene_kuntz',
	'jovanotti',
	'planet_funk',
];

function getUrl(path_name, artist, detail) {
	const { api_key, base_url, api_token } = state.config;
	if (path_name === 'artist' || path_name === 'album' || path_name === 'track') {
		if (detail) {
			par = 'm';
		} else {
			par = 'i';
		}
	} else {
		par = 's';
	}
	return `${base_url}/${api_key}/${path_name}.php?${par}=${artist}`;
}

async function getSearchAlbum(artist) {
	const searchAlbumUrl = getUrl(pathName[5], artist);

	const res = await getData(searchAlbumUrl);

	return res;
}

async function getSearch(artist) {
	const artistDetailUrl = getUrl(pathName[0], artist);
	const res = await getData(artistDetailUrl);
	return res.artists[0];
}

async function getArtistAlbumTrack(albumId) {
	const artistAlbumUrl = getUrl(pathName[4], albumId, true);
	const res = await getData(artistAlbumUrl);
	return res;
}

async function getData(url) {
	try {
		const response = await fetch(url);

		const rawResponse = await response.json();

		if (!response.ok) {
			throw rawResponse;
		}

		return rawResponse;
	} catch (errorMessage) {
		console.error(errorMessage);
	}
}

function handleHTMLMounted() {
	HOME.classList.toggle('is_visible');
}

function createArtist(artist, home = false, favorite = false) {
	const { strArtist, strBiographyIT, strStyle, strWebsite, strArtistBanner, strArtistLogo, strArtistThumb, idArtist } = artist;
	const card = document.createElement('div');
	card.classList.add('card');

	const img = document.createElement('img');
	img.dataset.artistName = strArtist;
	img.dataset.artistId = idArtist;
	img.dataset.newSection = ROUTELINK[2];
	img.classList.add('image');
	if (home) {
		img.addEventListener('click', handleCardClickHome);
	} else if (favorite) {
		img.addEventListener('click', handleCardClickFavorite);
	} else {
		img.addEventListener('click', handleCardClick);
	}
	if (strArtistThumb) {
		img.src = strArtistThumb;
	} else {
		img.src = 'https://via.placeholder.com/200x200';
	}

	const name = document.createElement('div');
	name.classList.add('name');
	name.textContent = strArtist;

	const starBtn = document.createElement('div');
	starBtn.classList.add('btn-star');
	starBtn.addEventListener('click', addToFavorite);
	const starIcon = document.createElement('i');
	starIcon.dataset.artistName = strArtist;
	starIcon.dataset.artistId = idArtist;
	starIcon.dataset.newSection = ROUTELINK[6];
	starIcon.classList.add('fa', 'fa-star');
	starBtn.dataset.artistName = strArtist;
	starBtn.dataset.artistId = idArtist;
	starBtn.dataset.newSection = ROUTELINK[6];
	starBtn.append(starIcon);

	card.append(img, name, starBtn);

	if (home) {
		HOME.append(card);
	} else if (favorite) {
		FAVORITE.append(card);
	} else {
		SEARCHTAB.append(card);
	}
}

function createDiscoAlbum(albums, home = false, favorite = false) {
	const cards = ARTISTDETAIL.querySelectorAll('.card');
	cards.forEach((el) => {
		el.remove();
	});

	albums.forEach((el) => {
		const { strAlbum, strArtist, idAlbum, idArtist, intYearReleased, strStyle, strAlbumThumb } = el;

		const card = document.createElement('div');
		card.classList.add('card');

		const img = document.createElement('img');
		img.dataset.artistName = strArtist;
		img.dataset.albumId = idAlbum;
		img.dataset.artistId = idArtist;
		img.dataset.newSection = ROUTELINK[3];
		img.classList.add('image');

		if (home) {
			img.addEventListener('click', handleAlbumClickHome);
		} else if (favorite) {
			img.addEventListener('click', handleAlbumClickFavorite);
		} else {
			img.addEventListener('click', handleAlbumClick);
		}

		const plusBtn = document.createElement('div');
		const plusIcon = document.createElement('i');
		plusBtn.classList.add('btn-plus');
		plusIcon.dataset.artistName = strArtist;
		plusIcon.dataset.artistId = idArtist;
		plusIcon.dataset.albumId = idAlbum;
		plusIcon.dataset.newSection = ROUTELINK[6];
		plusIcon.classList.add('fa', 'fa-heart');
		plusIcon.addEventListener('click', addToLibrary);
		plusBtn.dataset.artistName = strArtist;
		plusBtn.dataset.artistId = idArtist;
		plusBtn.dataset.albumId = idAlbum;

		plusBtn.dataset.newSection = ROUTELINK[6];
		plusBtn.append(plusIcon);

		const cartBtn = document.createElement('div');
		cartBtn.classList.add('btn-cart');
		const cartIcon = document.createElement('i');
		cartIcon.dataset.artistName = strArtist;
		cartIcon.dataset.artistId = idArtist;
		cartIcon.dataset.albumId = idAlbum;
		cartIcon.dataset.newSection = ROUTELINK[4];
		cartIcon.addEventListener('click', addToCartAlbum);
		cartIcon.classList.add('fa', 'fa-shopping-cart');
		cartBtn.append(cartIcon);

		if (strAlbumThumb) {
			img.src = strAlbumThumb;
		} else {
			img.src = 'https://via.placeholder.com/200x200';
		}
		const name = document.createElement('div');
		name.classList.add('name');
		name.textContent = strAlbum;

		card.append(img, name, cartBtn, plusBtn);

		ARTISTDETAIL.append(card);
	});
}

function createAlbum(singleAlbum) {
	const cards = ALBUMDETAIL.querySelectorAll('.card');
	cards.forEach((el) => {
		el.remove();
	});

	const { strAlbum, strArtist, idAlbum, idArtist, intYearReleased, strStyle, strAlbumThumb, intDuration } = singleAlbum;

	const track = singleAlbum.track;

	const card = document.createElement('div');
	card.classList.add('card');

	const img = document.createElement('img');
	img.dataset.artistName = strArtist;
	img.dataset.albumId = idAlbum;
	img.dataset.artistId = idArtist;
	img.dataset.newSection = ROUTELINK[4];
	img.classList.add('image');

	if (strAlbumThumb) {
		img.src = strAlbumThumb;
	} else {
		img.src = 'https://via.placeholder.com/200x200';
	}
	const name = document.createElement('div');
	name.classList.add('name');
	name.textContent = strAlbum;

	const date = document.createElement('div');
	date.classList.add('date');
	date.textContent = intYearReleased;

	const trackOl = document.createElement('ol');

	track.forEach((el) => {
		const trackLi = document.createElement('li');
		const title = document.createElement('span');
		title.textContent = el.strTrack;

		const durationInMillis = el.intDuration;
		const duration = millisToMinutesAndSeconds(durationInMillis);
		const time = document.createElement('span');
		time.textContent = duration;

		trackLi.append(title, time);
		trackOl.appendChild(trackLi);
	});

	card.append(img, name, date, trackOl);

	ALBUMDETAIL.append(card);
}

function createAlbumToLibrary(singleAlbum) {
	const { strAlbum, strArtist, idAlbum, idArtist, intYearReleased, strStyle, strAlbumThumb, intDuration } = singleAlbum;

	const track = singleAlbum.track;

	const card = document.createElement('div');
	card.classList.add('card');

	const img = document.createElement('img');
	img.dataset.artistName = strArtist;
	img.dataset.albumId = idAlbum;
	img.dataset.artistId = idArtist;
	img.dataset.newSection = ROUTELINK[4];
	img.classList.add('image');

	if (strAlbumThumb) {
		img.src = strAlbumThumb;
	} else {
		img.src = 'https://via.placeholder.com/200x200';
	}
	const name = document.createElement('div');
	name.classList.add('name');
	name.textContent = strAlbum;

	const date = document.createElement('div');
	date.classList.add('date');
	date.textContent = intYearReleased;

	const trackOl = document.createElement('ol');

	track.forEach((el) => {
		const trackLi = document.createElement('li');
		const title = document.createElement('span');
		title.textContent = el.strTrack;

		const durationInMillis = el.intDuration;
		const duration = millisToMinutesAndSeconds(durationInMillis);
		const time = document.createElement('span');
		time.textContent = duration;

		trackLi.append(title, time);
		trackOl.appendChild(trackLi);
	});

	card.append(img, name, date, trackOl);

	LIBRARY.append(card);
}

function createAlbumToCart(singleAlbum) {
	const { strAlbum, strArtist, idAlbum, idArtist, intYearReleased, strStyle, strAlbumThumb, intDuration } = singleAlbum;

	const track = singleAlbum.track;

	const card = document.createElement('div');
	card.classList.add('card');

	const img = document.createElement('img');
	img.dataset.artistName = strArtist;
	img.dataset.albumId = idAlbum;
	img.dataset.artistId = idArtist;
	img.dataset.newSection = ROUTELINK[4];
	img.classList.add('image');

	if (strAlbumThumb) {
		img.src = strAlbumThumb;
	} else {
		img.src = 'https://via.placeholder.com/200x200';
	}
	const name = document.createElement('div');
	name.classList.add('name');
	name.textContent = strAlbum;

	const date = document.createElement('div');
	date.classList.add('date');
	date.textContent = intYearReleased;

	const trackOl = document.createElement('ol');

	track.forEach((el) => {
		const trackLi = document.createElement('li');
		const title = document.createElement('span');
		title.textContent = el.strTrack;

		const durationInMillis = el.intDuration;
		const duration = millisToMinutesAndSeconds(durationInMillis);
		const time = document.createElement('span');
		time.textContent = duration;

		trackLi.append(title, time);
		trackOl.appendChild(trackLi);
	});

	card.append(img, name, date, trackOl);

	CART.append(card);
}

function createAlbumToMylist(singleAlbum) {
	const { strAlbum, strArtist, idAlbum, idArtist, intYearReleased, strStyle, strAlbumThumb, intDuration } = singleAlbum;

	const track = singleAlbum.track;

	const card = document.createElement('div');
	card.classList.add('card');

	const img = document.createElement('img');
	img.dataset.artistName = strArtist;
	img.dataset.albumId = idAlbum;
	img.dataset.artistId = idArtist;
	img.dataset.newSection = ROUTELINK[4];
	img.classList.add('image');

	if (strAlbumThumb) {
		img.src = strAlbumThumb;
	} else {
		img.src = 'https://via.placeholder.com/200x200';
	}
	const name = document.createElement('div');
	name.classList.add('name');
	name.textContent = strAlbum;

	const date = document.createElement('div');
	date.classList.add('date');
	date.textContent = intYearReleased;

	const trackOl = document.createElement('ol');

	track.forEach((el) => {
		const trackLi = document.createElement('li');
		const title = document.createElement('span');
		title.textContent = el.strTrack;

		const durationInMillis = el.intDuration;
		const duration = millisToMinutesAndSeconds(durationInMillis);
		const time = document.createElement('span');
		time.textContent = duration;

		trackLi.append(title, time);
		trackOl.appendChild(trackLi);
	});

	card.append(img, name, date, trackOl);

	const msg = PAID.querySelector('.init-msg');
	msg.classList.add('init-msg-is_hidden');

	PAID.append(card);
}

function addToFavorite(e) {
	const agree = confirm('Aggiungi ai favoriti?');
	if (agree) {
		const name = e.target.dataset.artistName;
		const sectionToGo = e.target.dataset.newSection;
		showSection(sectionToGo);
		onClickFavorite(name);
	}
}

function addToCartAlbum(e) {
	const albumId = e.target.dataset.albumId;
	const artistId = e.target.dataset.artistId;
	const newSectionName = e.target.dataset.newSection;

	alert('aggiunto al carrello');
	let allState = [...homeState, ...artistState, ...favoriteState];
	const artist = allState.filter((artist) => artist.idArtist === artistId);

	const album = artist[0].newAlbum.filter((album) => album.idAlbum === albumId);

	cartState.push(album[0]);

	if (cartState.length > 1) {
		const btn = CART.querySelector('button');
		btn.classList.toggle('btn-is_visible');
		const msg = CART.querySelector('.init-msg');
		msg.classList.toggle('init-msg-is_hidden');
		const cards = CART.querySelectorAll('.card');
		cards.forEach((el) => {
			el.remove();
		});
		cartState.forEach((el) => {
			createAlbumToCart(el);
		});

		showMainBySectionName(newSectionName);
	} else {
		const btn = CART.querySelector('button');
		btn.classList.toggle('btn-is_visible');
		const msg = CART.querySelector('.init-msg');
		msg.classList.toggle('init-msg-is_hidden');
		const cards = CART.querySelectorAll('.card');
		cards.forEach((el) => {
			el.remove();
		});
		createAlbumToCart(album[0]);
		showMainBySectionName(newSectionName);
	}
}

function addToLibrary(e) {
	const albumId = e.target.dataset.albumId;
	const artistId = e.target.dataset.artistId;
	alert('Aggiunto alla lista dei desideri.');
	let allState = [...homeState, ...artistState, ...favoriteState];

	const artist = allState.filter((artist) => artist.idArtist === artistId);

	const album = artist[0].newAlbum.filter((album) => album.idAlbum === albumId);

	libraryState.push(album[0]);

	if (libraryState.length > 1) {
		const msg = LIBRARY.querySelector('.init-msg');
		msg.classList.add('init-msg-is_hidden');
		const cards = LIBRARY.querySelectorAll('.card');
		cards.forEach((el) => {
			el.remove();
		});
		libraryState.forEach((el) => {
			createAlbumToLibrary(el);
		});
		showLibrary();
	} else {
		const msg = LIBRARY.querySelector('.init-msg');
		msg.classList.add('init-msg-is_hidden');
		const cards = LIBRARY.querySelectorAll('.card');
		cards.forEach((el) => {
			el.remove();
		});
		createAlbumToLibrary(album[0]);
		showLibrary();
	}
}

function handleCardClick(e) {
	const id = e.target.dataset.artistId;
	const sectionToGo = e.target.dataset.newSection;
	showSection(sectionToGo);
	const state = artistState.filter((single) => single.idArtist === id);
	createDiscoAlbum(state[0].newAlbum);
}

function handleCardClickHome(e) {
	const id = e.target.dataset.artistId;
	const sectionToGo = e.target.dataset.newSection;
	showSection(sectionToGo);
	const state = homeState.filter((single) => single.idArtist === id);
	createDiscoAlbum(state[0].newAlbum, true);
}

function handleCardClickFavorite(e) {
	const id = e.target.dataset.artistId;
	const sectionToGo = e.target.dataset.newSection;
	showSection(sectionToGo);
	const state = favoriteState.filter((single) => single.idArtist === id);
	createDiscoAlbum(state[0].newAlbum, false, true);
}

function handleAlbumClick(e) {
	const idArtist = e.target.dataset.artistId;
	const idAlbum = e.target.dataset.albumId;
	const sectionToGo = e.target.dataset.newSection;
	showSection(sectionToGo);
	const stateArtist = artistState.filter((single) => single.idArtist === idArtist);
	const stateAlbum = stateArtist[0].newAlbum.filter((singleAlbum) => singleAlbum.idAlbum === idAlbum);
	createAlbum(stateAlbum[0]);
}

function handleAlbumClickHome(e) {
	const idArtist = e.target.dataset.artistId;
	const idAlbum = e.target.dataset.albumId;
	const sectionToGo = e.target.dataset.newSection;
	showSection(sectionToGo);
	const stateArtist = homeState.filter((single) => single.idArtist === idArtist);
	const stateAlbum = stateArtist[0].newAlbum.filter((singleAlbum) => singleAlbum.idAlbum === idAlbum);
	createAlbum(stateAlbum[0]);
}

function handleAlbumClickFavorite(e) {
	const idArtist = e.target.dataset.artistId;
	const idAlbum = e.target.dataset.albumId;
	const sectionToGo = e.target.dataset.newSection;
	showSection(sectionToGo);
	const stateArtist = favoriteState.filter((single) => single.idArtist === idArtist);
	const stateAlbum = stateArtist[0].newAlbum.filter((singleAlbum) => singleAlbum.idAlbum === idAlbum);
	createAlbum(stateAlbum[0]);
}

function showSection(section) {
	const currentSection = document.querySelector('.is_visible');
	if (currentSection.className.includes('home') || currentSection.className.includes('search') || currentSection.className.includes('favorite')) {
		previousSection = currentSection.className;
	}
	const newSection = document.querySelector(`.${section}`);
	if (currentSection === newSection) {
		null;
	} else {
		currentSection.classList.toggle('is_visible');
		setTimeout(() => {
			newSection.classList.toggle('is_visible');
		}, 150);
	}
}

async function onSubmit(e) {
	let include;
	let album = [];
	e.preventDefault();
	const artistName = e.target[0].value.replace(' ', '_');
	e.target[0].value = '';

	const artist = await getSearch(artistName);

	album = await getSearchAlbum(artistName);
	let newAlbum = [];

	await getSearchAlbum(artistName).then((res) => {
		res.album.forEach(async (album, i) => {
			const tracks = await getArtistAlbumTrack(album.idAlbum).then((res) => {
				newAlbum.push({ ...album, ...res });
			});
		});
	});

	const albumPlusTrack = { newAlbum };
	const artistAlbumTrack = { ...artist, ...albumPlusTrack };

	let exist;

	if (artistState.length === 0) {
		artistState.push(artistAlbumTrack);

		renderCard(artistState);
	} else {
		artistState.forEach((el) => {
			exist = artistState.filter((artist) => artist.idArtist === artistAlbumTrack.idArtist);
		});

		if (exist.length > 0) {
			alert('presente');
		} else {
			artistState.push(artistAlbumTrack);
			renderCard(artistState);
		}
	}
	showSearch();
}

function initialState() {
	const cards = HOME.querySelectorAll('.card');
	cards.forEach((el) => {
		el.remove();
	});
	artistName.forEach((el) => {
		onLoad(el);
	});
}

async function onLoad(artist) {
	let album = [];
	const artistName = artist;

	const artistHome = await getSearch(artistName);

	album = await getSearchAlbum(artistName);
	let newAlbum = [];

	await getSearchAlbum(artistName).then((res) => {
		res.album.forEach(async (album, i) => {
			const tracks = await getArtistAlbumTrack(album.idAlbum).then((res) => {
				newAlbum.push({ ...album, ...res });
			});
		});
	});

	const albumPlusTrack = { newAlbum };
	const artistAlbumTrack = { ...artistHome, ...albumPlusTrack };

	let exist;

	if (homeState.length === 0) {
		homeState.push(artistAlbumTrack);

		renderCardHome(homeState);
	} else {
		homeState.forEach((el) => {
			exist = homeState.filter((artist) => artist.idArtist === artistAlbumTrack.idArtist);
		});

		if (exist.length > 0) {
			alert('presente');
		} else {
			homeState.push(artistAlbumTrack);
			renderCardHome(homeState);
		}
	}
}

async function onClickFavorite(artist) {
	let album = [];
	const artistName = artist;

	const artistFavorite = await getSearch(artistName);

	album = await getSearchAlbum(artistName);
	let newAlbum = [];

	await getSearchAlbum(artistName).then((res) => {
		res.album.forEach(async (album, i) => {
			const tracks = await getArtistAlbumTrack(album.idAlbum).then((res) => {
				newAlbum.push({ ...album, ...res });
			});
		});
	});

	const albumPlusTrack = { newAlbum };
	const artistAlbumTrack = { ...artistFavorite, ...albumPlusTrack };

	let exist;

	if (favoriteState.length === 0) {
		favoriteState.push(artistAlbumTrack);
		renderCardFavorite(favoriteState);
	} else {
		favoriteState.forEach((el) => {
			exist = favoriteState.filter((artist) => artist.idArtist === artistAlbumTrack.idArtist);
		});

		if (exist.length > 0) {
			alert('presente');
		} else {
			favoriteState.push(artistAlbumTrack);
			renderCardFavorite(favoriteState);
		}
	}
}

function renderCard(globalState) {
	const msg = SEARCHTAB.querySelector('.init-msg');
	msg.classList.add('init-msg-is_hidden');
	const cards = SEARCHTAB.querySelectorAll('.card');
	cards.forEach((el) => {
		el.remove();
	});
	globalState.forEach((artist) => {
		createArtist(artist);
	});
}

function renderCardHome(globalState) {
	const cards = HOME.querySelectorAll('.card');
	cards.forEach((el) => {
		el.remove();
	});
	globalState.forEach((artist) => {
		createArtist(artist, true);
	});
}

function renderCardFavorite(globalState) {
	const msg = FAVORITE.querySelector('.init-msg');
	msg.classList.add('init-msg-is_hidden');
	const cards = FAVORITE.querySelectorAll('.card');
	cards.forEach((el) => {
		el.remove();
	});
	globalState.forEach((artist) => {
		createArtist(artist, false, true);
	});
}

function renderCardCart(globalState) {
	const cards = CART.querySelectorAll('.card');
	cards.forEach((el) => {
		el.remove();
	});
	globalState.forEach((artist) => {
		createArtist(artist, false, true);
	});
}

function renderCardMyList(globalState) {
	const cards = PAID.querySelectorAll('.card');
	cards.forEach((el) => {
		el.remove();
	});
	globalState.forEach((artist) => {
		createArtist(artist, false, true);
	});
}

function onClickToBtnPay() {
	const total = cartState.length * 9.99;
	confirm(`pagamento ${total}...`);

	paidState = [...cartState];
	cartState = [];
	const btn = CART.querySelector('button');
	btn.classList.toggle('btn-is_visible');
	const msg = CART.querySelector('.init-msg');
	msg.classList.toggle('init-msg-is_hidden');

	const cards = CART.querySelectorAll('.card');
	cards.forEach((el) => {
		el.remove();
	});
	showMainBySectionName('paid');
	if (paidState.length > 0) {
		paidState.forEach((el) => {
			createAlbumToMylist(el);
		});
	} else {
		createAlbumToMylist(paidState[0]);
	}
}

BTNPAY.addEventListener('click', onClickToBtnPay);

SEARCH.addEventListener('submit', onSubmit);

document.addEventListener('DOMContentLoaded', handleHTMLMounted, { once: true });

document.addEventListener('DOMContentLoaded', initialState, { once: true });
