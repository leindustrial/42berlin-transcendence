document.addEventListener('DOMContentLoaded', function() {
    var button = document.getElementById('myButton');
    var content = document.getElementById('content');

    button.addEventListener('click', function() {
        // Change the content of the div
        content.textContent = "The content has been changed!";
        // Change the class of the div to apply new styles
        content.classList.add('changed');
        // Change the background color of the body
        document.body.style.backgroundColor = '#e0f7fa';
    });
});