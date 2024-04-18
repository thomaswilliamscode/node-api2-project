// implement your posts router here
const express = require('express')
const Posts = require('./posts-model.js')

const router = express.Router()

// | 1 | GET    | /api/posts              | Returns **an array of all the post objects** contained in the database 

// - If there's an error in retrieving the _posts_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON: `{ message: "The posts information could not be retrieved" }`.

router.get( '/',  async ( req, res ) => {
	try {
		const posts = await Posts.find()
		res.status(200).json(posts)
	} catch(err) {
		res.status(500).json({message: 'The posts information could not be retrieved'})
	}
	
})
// | 2 | GET    | /api/posts/:id          | Returns **the post object with the specified id** 

// - If the _post_ with the specified `id` is not found:

//   - return HTTP status code `404` (Not Found).
//   - return the following JSON: `{ message: "The post with the specified ID does not exist" }`.

// - If there's an error in retrieving the _post_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON: `{ message: "The post information could not be retrieved" }`.

router.get('/:id', async (req, res) => {
	try {
		const post = await Posts.findById(req.params.id);
		if(post) {
			res.status(200).json(post);
		} else {
			res.status(404).json({message: 'The post with the specified ID does not exist'})
		}
		
	} catch (err) {
		res
			.status(500)
			.json({ message: 'The posts information could not be retrieved' });
	}
});


// | 3 | POST   | /api/posts              | Creates a post using the information sent inside the request body and returns **the newly created post object**    

// - If the request body is missing the `title` or `contents` property:

//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON: `{ message: "Please provide title and contents for the post" }`.

// - If the information about the _post_ is valid:

//   - save the new _post_ the the database.
//   - return HTTP status code `201` (Created).
//   - return the newly created _post_.

// - If there's an error while saving the _post_:
//   - respond with HTTP status code `500` (Server Error).
//   - return the following JSON: `{ message: "There was an error while saving the post to the database" }`.

router.post('/', async (req, res) => {
	try {
		const { title, contents } = req.body
		if ( title && contents ) {
			const create = await Posts.insert(req.body);
			const find = await Posts.find()
			const newPost = find[find.length - 1]
			res.status(201).json(newPost);
		} else {
			res
				.status(400)
				.json({ message: 'Please provide title and contents for the post' });
		}
		
	} catch (err) {
		res
			.status(500)
			.json({
				message: 'There was an error while saving the post to the database',
			});
	}
});

// | 4 | PUT    | /api/posts/:id          | Updates the post with the specified id using data from the request body and **returns the modified document**, not the original |

// - If the _post_ with the specified `id` is not found:

//   - return HTTP status code `404` (Not Found).
//   - return the following JSON: `{ message: "The post with the specified ID does not exist" }`.

// - If the request body is missing the `title` or `contents` property:

//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON: `{ message: "Please provide title and contents for the post" }`.

// - If there's an error when updating the _post_:

//   - respond with HTTP status code `500`.
//   - return the following JSON: `{ message: "The post information could not be modified" }`.

// - If the post is found and the new information is valid:

//   - update the post document in the database using the new information sent in the `request body`.
//   - return HTTP status code `200` (OK).
//   - return the newly updated _post_.

router.put('/:id', async (req, res) => {
	try {
		const { title, contents } = req.body
		const find = await Posts.findById(req.params.id)
		if (title && contents && find ) {
			const update = await Posts.update(req.params.id, req.body);
			const findNew = await Posts.findById(req.params.id);
			res.status(200).json(findNew);
		} else if (!find) {
				res.status(404).json({message: 'The post with the specified ID does not exist',});
		} else if (!title || !contents) {
			res.status(400).json({ message: 'Please provide title and contents for the post' });
		} else {
			res.status(400).json({ message: 'Something crazy is going on' });
		}
	} catch (err) {
		res
			.status(500)
			.json({ message: 'The posts information could not be modified' });
	}
});

// | 5 | DELETE | /api/posts/:id          | Removes the post with the specified id and returns the **deleted post object**    

// - If the _post_ with the specified `id` is not found:

//   - return HTTP status code `404` (Not Found).
//   - return the following JSON: `{ message: "The post with the specified ID does not exist" }`.

// - If there's an error in removing the _post_ from the database:

//   - respond with HTTP status code `500`.
//   - return the following JSON: `{ message: "The post could not be removed" }`.

router.delete('/:id', async (req, res) => {
	try {
		const find = await Posts.findById(req.params.id);
		if (find) {
			const remove = await Posts.remove(req.params.id);
			res.status(200).json(find);
		} else if (!find) {
			res
				.status(404)
				.json({ message: 'The post with the specified ID does not exist' });
		}
	} catch (err) {
		res
			.status(500)
			.json({ message: 'The post could not be removed' });
	}
});

// | 6 | GET    | /api/posts/:id/comments | Returns an **array of all the comment objects** associated with the post with the specified id  

// - If the _post_ with the specified `id` is not found:

//   - return HTTP status code `404` (Not Found).
//   - return the following JSON: `{ message: "The post with the specified ID does not exist" }`.

// - If there's an error in retrieving the _comments_ from the database:

//   - respond with HTTP status code `500`.
//   - return the following JSON: `{ message: "The comments information could not be retrieved" }`.

router.get('/:id/comments', async (req, res) => {
	try {
		const post = await Posts.findById(req.params.id);
		if (post) {
			const comments = await Posts.findPostComments(req.params.id)
			res.status(200).json(comments);
		} else {
			res
				.status(404)
				.json({ message: 'The post with the specified ID does not exist' });
		}
	} catch (err) {
		res
			.status(500)
			.json({ message: 'The posts information could not be retrieved' });
	}
});


module.exports = router