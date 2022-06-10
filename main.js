function readTextFile(file, callback) {
    const rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status === 200) {
            callback(rawFile.responseText);
        }
    };
    rawFile.send(null);
}

const parseQueryString = function(varName) {
    const str = window.location.search;
    const objURL = {};

    str.replace(
        new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
        function( $0, $1, $2, $3 ){
            objURL[ $1 ] = $3;
        }
    );
    return objURL[varName];
};

function redirectPlant(plant) {
    window.location.href = "rastlina.php?rastlina=" + plant;
}

function redirectLink(link) {
    window.location.href = link
}

function loadPlantText() {
    const tehRastlina = parseQueryString("rastlina");
    let plantDataStr = "";
    let viriStr = "";

    readTextFile("./text.json", function(text) {
        const jsonData = JSON.parse(text);
        const plants = jsonData["plants"];

        for (const podrocje in plants) {
            const podrocjeObj = plants[podrocje]["plants"]
            if (plantDataStr === "") {
                for (const testRastlina in podrocjeObj) {
                    if (testRastlina === tehRastlina) {
                        const rastlinaObj = podrocjeObj[testRastlina]
                        let rastlina = rastlinaObj["lat"];

                        plantDataStr += `
<div class="rastlinaFlex">
<h1><i>${rastlina}</i> (${rastlinaObj["slo"]})</h1>
</div>
<hr>`;
                        plantDataStr += `<div id="rastlinaZnacilnosti">`;
                        if ("znacilnosti" in rastlinaObj) {
                            plantDataStr += `<h3>Značilnosti</h3><p>${rastlinaObj["znacilnosti"]}</p>`
                        }
                        if ("videz" in rastlinaObj) {
                            plantDataStr += `<h3>Videz</h3><p>${rastlinaObj["videz"]}</p>`
                        }
                        if ("listi" in rastlinaObj) {
                            plantDataStr += `<h3>Listi</h3><p>${rastlinaObj["listi"]}</p>`
                        }
                        if ("plodovi" in rastlinaObj) {
                            plantDataStr += `<h3>Plodovi</h3><p>${rastlinaObj["plodovi"]}</p>`
                        }
                        if ("cvetovi" in rastlinaObj) {
                            plantDataStr += `<h3>Cvetovi</h3><p>${rastlinaObj["cvetovi"]}</p>`
                        }
                        plantDataStr += `<hr><h3>Viri besedil</h3>`
                        for (const vir in rastlinaObj["viri"]) {
                            viriStr += rastlinaObj["viri"][vir] + "<br>"
                        }
                        plantDataStr += `<p>${viriStr}</p>`
                        plantDataStr += `</div>`

                        document.getElementById('loadTextDivId').innerHTML = plantDataStr;

                        break;
                    }
                }
            }
        }
    });
}

function redirectPodrocje(podrocje) {
    window.location.href = "podrocje.php?podrocje=" + podrocje;
}

function loadPodrocje() {
    const tehPodrocje = parseQueryString("podrocje");
    let podrocje = "";
    let podrocjeDataStr = "";

    readTextFile("./text.json", function(text) {
        const jsonData = JSON.parse(text);

        for (const testPodrocje in jsonData["plants"]) {
            if (testPodrocje === tehPodrocje) {
                podrocje = jsonData["plants"][tehPodrocje];
                podrocjeDataStr += `
<div class="rastlinaFlex">
<h1>${podrocje["name"]}</h1>
<p class="podrocjeIme" onclick="redirectLink('podrocja.php')">[Področja]</p>
</div><hr>`;
                for (const plant in podrocje["plants"]) {
                    const plantObj = podrocje["plants"][plant]
                    podrocjeDataStr += `
<a href="https://salamelek.rikis.net/testpage/botanicni_vrt2/rastlina.php?rastlina=${plant}" class="plantLink"><i>${plantObj["lat"]}</i> | ${plantObj["slo"]}</a><br>
`;
                }
                document.getElementById('loadTextDivId').innerHTML = podrocjeDataStr;
                break;
            }
        }
    });
}

function loadText(element) {
    readTextFile("./text.json", function(text){
        const jsonData = JSON.parse(text);

        if (element === "index") {
            document.getElementById("loadTextIntroduction").innerHTML = jsonData[element]["introduction"];
            document.getElementById("loadTextTloris").innerHTML = jsonData[element]["tloris"];
        }
        else if (element === "info") {
            document.getElementById("loadTextNastanek").innerHTML = jsonData[element]["nastanek"];
            document.getElementById("loadTextPrimorski").innerHTML = jsonData[element]["primorski"];
            document.getElementById("loadTextNovi_glas").innerHTML = jsonData[element]["novi_glas"];
        }
        else if (element === "podrocja") {
            let podrocjaStr = "";
            const plantsData = jsonData["plants"];

            for (const podrocje in plantsData) {
                podrocjaStr += `
<p onclick="redirectPodrocje('${podrocje}')" class="podrocjeLink">${plantsData[podrocje]["name"]}</p>`;
            }
            document.getElementById("loadTextDivId").innerHTML = podrocjaStr;
        }
        else if (element === "plantsList") {
            const plantsData = jsonData["plants"];
            const plantsList = [];
            let plantsStr = "";

            for (const podrocje in plantsData) {
                const podrocjeObj = plantsData[podrocje];
                for (const rast in podrocjeObj["plants"]) {
                    const rastObj = podrocjeObj["plants"][rast]
                    let rastLink = "https://salamelek.rikis.net/testpage/botanicni_vrt2/rastlina.php?rastlina=" + rast
                    const plant = `
<a class="plantLink" href="${rastLink}"><i>${rastObj["lat"]}</i> | ${rastObj["slo"]}</a><br>`;

                    if (!plantsList.includes(plant)) {
                        plantsList.push(plant);
                    }
                }
            }
            plantsList.sort();
            for (const plant in plantsList) {
                plantsStr += plantsList[plant];
            }
            document.getElementById("loadTextDivId").innerHTML = plantsStr;
        }
        else if (element === "quiz") {
            document.getElementById("loadTextDivId").innerHTML = jsonData[element];
        }
        else if (element === "viri") {
            document.getElementById("loadTextDivId").innerHTML = jsonData[element];
        }
        else if (element === "workInProgress") {
            document.getElementById("loadTextDivId").innerHTML = jsonData[element];
        }
    });
}

