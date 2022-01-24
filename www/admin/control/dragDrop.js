const drag = (item) => {
    item.dataTransfer.setData("text", item.target.id);
}

const drop = (item) => {
    item.preventDefault();
    var data = item.dataTransfer.getData("text");
    item.target.appendChild(document.getElementById(data));
}

const allowDrop = (item) => {
    item.preventDefault();
}