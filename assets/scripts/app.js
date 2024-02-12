const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');
const form = document.querySelector('#new-post form');
const fetchButton = document.querySelector('#available-posts button');

function sendHttpRequest(method, url, data) {
	// const promise = new Promise((resolve, reject) => {
	// 	const xhr = new XMLHttpRequest();

	// 	xhr.open(method, url);
	// 	xhr.responseType = 'json';
	// 	xhr.onload = () =>
	// 		xhr.status >= 200 && xhr.status < 300
	// 			? resolve(xhr.response)
	// 			: reject(new Error('Something went wronf at the server side!'));
	// 	xhr.onerror = () => reject(new Error('Failed to send request!'));
	// 	xhr.send(JSON.stringify(data));
	// });
	// return promise;
	return fetch(url, {
		method: method,
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/josn',
		},
	})
		.then(response => {
			if (response.status >= 200 && response.status < 300) {
				response.json();
			} else {
				return response.json().then(errData => {
					console.log('ErrData fromt eh server', errData);
					throw new Error('Something went wrong - server side');
				});
			}
		})
		.catch(error => {
			console.log(error);
			throw new Error('Something went wrong - request side!');
		});
}

async function fetchPosts() {
	try {
		const responseData = await sendHttpRequest('GET', 'https://jsonplaceholder.typicode.com/posts');
		const listOfPosts = responseData;
		for (const post of listOfPosts) {
			const postEl = document.importNode(postTemplate.content, true);
			postEl.querySelector('h2').textContent = post.title.toUpperCase();
			postEl.querySelector('p').textContent = post.body;
			postEl.querySelector('li').id = post.id;
			listElement.append(postEl);
		}
	} catch (error) {
		alert(error.message);
	}
}

async function createPost(title, content) {
	const userId = Math.random();
	const post = {
		title: title,
		body: content,
		userId: userId,
	};

	sendHttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts', post);
}

async function deletePost(e) {
	if (e.target.tagName === 'BUTTON') {
		const postId = e.target.closest('li').id;
		sendHttpRequest('DELETE', `https://jsonplaceholder.typicode.com/posts/${postId}`);
	}
}

fetchButton.addEventListener('click', fetchPosts);

form.addEventListener('submit', event => {
	event.preventDefault();
	const enteredTitle = event.currentTarget.querySelector('#title').value;
	const enteredContent = event.currentTarget.querySelector('#content').value;

	createPost(enteredTitle, enteredContent);
});

listElement.addEventListener('click', deletePost);
