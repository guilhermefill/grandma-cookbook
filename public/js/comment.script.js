const addCommentButton = document.getElementById('add-comment-btn');
const commentDiv = document.getElementById('comment-box');

addCommentButton.onclick = () => {
    commentDiv.innerHTML += `
        <input type="text" name="title" placeholder="Title">
        <textarea name="comment" cols="30" rows="10" placeholder="Add your notes about the recipe here"></textarea>
        <button type="submit">Submit comment</button>
    `
} 