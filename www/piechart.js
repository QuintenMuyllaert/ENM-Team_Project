const drawPie = () => {
    let pie = document.querySelectorAll('.js-pie');
    for (let piece of pie){
        if (piece.getAttribute('data-name') == "duiktank"){
            duiktank = 50
            piece.style.stroke = "#000000";
            percentage = duiktank / 100 * 283.14;
            piece.style.strokeDashoffset = percentage;
            //283.140 is de top en zorgt voor niks van percentage (100%)
        }
    }
}