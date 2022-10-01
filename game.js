const container = document.getElementById("container");
const startPage = document.getElementById("start-page");
const legInput = document.getElementById("leg-input");
const menuPage = document.getElementById("menu-page");
const oldMenuPage = menuPage.cloneNode(true);
const runPage = document.getElementById("run-page");
const runPageCopy = runPage.cloneNode(true);
const resultPage = document.getElementById("result-page");
const resultPageCopy = resultPage.cloneNode(true);
let resultContainer = document.getElementById("results");
let ghostLegCrt = document.getElementById("ghost-leg-container");
let ghostLegCrtCopy = ghostLegCrt.cloneNode(true);
let legShow = {};
let topInput = {};
let middleLine = {};
let bottomInout = {};

const config = {
  minLegs: 2,
  maxLegs: 20,
  chunkSize: 5,
};

const state = {
  legNumber: 5,
  legScrollPosition: 0,
  topValues: [],
  bottomValues: [],
  results: [],
};

const runPageLeg = {
  path: [],
  legContainer: {},
  vLinesPoints: [],
  colors: [
    "DarkBlue",
    "DarkCyan",
    "DarkGoldenRod",
    "DarkGray",
    "DarkGrey",
    "DarkGreen",
    "DarkKhaki",
    "DarkMagenta",
    "DarkOliveGreen",
    "DarkOrange",
    "DarkOrchid",
    "DarkRed",
    "DarkSalmon",
    "DarkSeaGreen",
    "DarkSlateBlue",
    "DarkSlateGray",
    "DarkSlateGrey",
    "DarkTurquoise",
    "DarkViolet",
    "DeepPink",
    "DeepSkyBlue",
    "DimGray",
    "DimGrey",
    "DodgerBlue",
  ],
};

const docs = {
  topInputs: [],
  bottomInputs: [],
  topDataInput: {},
  bottomDataInput: {},
};

const init = () => {
  unhideElement(startPage);
  legInput.value = config.minLegs;
  hideElement(menuPage);
  hideElement(runPage);
  hideElement(resultPage);
};

const increaseLeg = () => {
  if (legInput.value < config.maxLegs) return legInput.value++;
  legInput.value = config.maxLegs;
};

const decreaseLeg = () => {
  if (legInput.value > config.minLegs) return legInput.value--;
  legInput.value = config.minLegs;
};

legInput.addEventListener("change", () => {
  let v = parseInt(this.value);
  if (v < config.minLegs) this.value = config.minLegs;
  else if (v > config.maxLegs) this.value = config.maxLegs;
});

const openFullscreen = async () => {
  if (!document.fullscreenElement) {
    await container.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

const start = () => {
  if (config.minLegs <= legInput.value && legInput.value <= config.maxLegs) {
    state.legNumber = legInput.value;
    hideElement(startPage);
    startMenuPage();
  } else {
    alert("Leg must be in 2 to 20");
  }
};

const leftScrollLegShow = (element) => {
  state.legScrollPosition = legShow.scrollLeft;
  legShow.scrollLeft += 500;
};

const rightScrollLegShow = (element) => {
  state.legScrollPosition = legShow.scrollLeft;
  legShow.scrollLeft -= 500;
};

const hideElement = (element) => {
  const hideClass = "hide-element";
  if (!element.classList.contains(hideClass)) {
    element.classList.add(hideClass);
  }
};

const unhideElement = (element) => {
  const hideClass = "hide-element";
  if (element.classList.contains(hideClass)) {
    element.classList.remove(hideClass);
  }
};

const showElement = (element) => {
  const hideClass = "hide-element";
  if (element.classList.contains(hideClass)) {
    element.classList.remove(hideClass);
  }
};

const createTopInput = (id) => {
  const value = id.slice(id.indexOf("-") + 1);
  const td = document.createElement("td");
  const input = document.createElement("input");
  input.classList.add("top-input");
  input.type = "text";
  input.maxLength = `${config.chunkSize}`;
  input.setAttribute("id", id);
  input.value = value;
  td.appendChild(input);
  docs.topInputs[parseInt(value)] = input;
  return td;
};

const createMiddleLine = () => {
  const td = document.createElement("td");
  const div = document.createElement("div");
  div.classList.add("connect-line");
  td.appendChild(div);
  return td;
};

const createBottomInput = (id) => {
  const value = id.slice(id.indexOf("-") + 1);
  const td = document.createElement("td");
  const input = document.createElement("input");
  input.classList.add("top-input");
  input.type = "text";
  input.maxLength = `${config.chunkSize}`;
  input.setAttribute("id", id);
  input.value = value;
  td.appendChild(input);
  docs.bottomInputs[parseInt(value)] = input;
  return td;
};

const createLegTable = () => {
  for (i = 0; i < state.legNumber; i++) {
    topInput.appendChild(createTopInput(`topInput-${i}`));
    middleLine.appendChild(createMiddleLine());
    bottomInout.appendChild(createBottomInput(`bottomInput-${i}`));
  }
};

const createDataInput = () => {
  const row = document.getElementById("entry-tabel-data-row");
  const textarea = document.createElement("textarea");
  const td = document.createElement("td");
  textarea.type = "text";
  textarea.setAttribute("id", "top-data-input");
  textarea.setAttribute("oninput", "checkInput(this)");
  textarea.maxLength = (
    state.legNumber +
    state.legNumber * config.chunkSize
  ).toString();
  textarea.classList.add("entry-table-textarea");
  td.appendChild(textarea);
  row.appendChild(td);
  const bottom = textarea.cloneNode();
  bottom.setAttribute("id", "bottom-data-input");
  row.appendChild(bottom);
  docs.topDataInput = textarea;
  docs.bottomDataInput = bottom;
};

function sliceStringInChunks(string, values, chunkSize) {
  string = string.trim();
  string = string.replace(/ /g, "");
  const charArray = [...string];
  const valuesArray = new Array(values).fill("");
  let value = "";
  let valueCount = 0;
  charArray.forEach((char, index) => {
    value += char;
    if (!value.startsWith("\n")) {
      if (
        value.length >= chunkSize ||
        value.endsWith("\n") ||
        value.endsWith(",") ||
        index === charArray.length - 1
      ) {
        value = value.trim();
        value = value.replace(/,/, "");
        value = value.replace(/\n/, "");
        valuesArray[valueCount] = value;
        valueCount++;
        value = "";
      }
    } else {
      value = "";
    }
  });
  return valuesArray;
}

const insertInputValues = () => {
  const topString = docs.topDataInput.value;
  docs.topDataInput.value = topString.trim();
  let stringArray = sliceStringInChunks(
    topString,
    docs.topInputs.length,
    config.chunkSize
  );
  docs.topInputs.forEach((topInput, index) => {
    topInput.value = stringArray[index];
  });

  const bottomString = docs.bottomDataInput.value;
  docs.bottomDataInput.value = bottomString.trim();
  stringArray = sliceStringInChunks(
    bottomString,
    docs.bottomInputs.length,
    config.chunkSize
  );
  docs.bottomInputs.forEach((bottomInput, index) => {
    bottomInput.value = stringArray[index];
  });

  updateValueState();
};

const updateValueState = () => {
  docs.topInputs.forEach((topInput) => {
    const index = topInput.id.slice(topInput.id.indexOf("-") + 1);
    state.topValues[index] = topInput.value;
  });
  docs.bottomInputs.forEach((bottomInput) => {
    const index = bottomInput.id.slice(bottomInput.id.indexOf("-") + 1);
    state.bottomValues[index] = bottomInput.value;
  });
};

const updateBoxValues = () => {
  docs.topInputs.forEach((topInput) => {
    const index = topInput.id.slice(topInput.id.indexOf("-") + 1);
    topInput.value = state.topValues[index];
  });
  docs.bottomInputs.forEach((bottomInput) => {
    const index = bottomInput.id.slice(bottomInput.id.indexOf("-") + 1);
    bottomInput.value = state.bottomValues[index];
  });
};

const shuffler = (valuesArr) => {
  const values = valuesArr.length;
  let newArray = Array(values)
    .fill()
    .map((_, i) => i);
  let newValues = [];
  let arrLength = newArray.length;
  for (let i = 0; i < arrLength; i++) {
    let randIndex = getRndInteger(0, newArray.length - 1);
    let value = newArray.splice(randIndex, 1);
    newValues.push(valuesArr[value[0]]);
  }
  return newValues;
};

const shuffle = () => {
  updateValueState();
  state.topValues = shuffler(state.topValues);
  state.bottomValues = shuffler(state.bottomValues);
  updateBoxValues();
};

const gotoRunPage = () => {
  updateValueState();
  hideElement(menuPage);
  renderRunPage();
};

const startMenuPage = () => {
  unhideElement(menuPage);
  menuPage.innerHTML = oldMenuPage.innerHTML;
  docs.topInputs = [];
  docs.bottomInputs = [];
  docs.topDataInput = {};
  docs.bottomDataInput = {};
  state.legScrollPosition = 0;
  state.topValues = [];
  state.bottomValues = [];
  legShow = document.getElementById("leg-show");
  topInput = document.getElementById("top-input-row");
  middleLine = document.getElementById("middle-connect-line");
  bottomInout = document.getElementById("bottom-input-row");
  createLegTable();
  createDataInput();
  let pScrollBtn = document.getElementById("scroll-btn-p");
  let nScrollBtn = document.getElementById("scroll-btn-n");
  if (legShow.offsetWidth === legShow.scrollWidth) {
    hideElement(pScrollBtn);
    hideElement(nScrollBtn);
  } else {
    unhideElement(pScrollBtn);
    unhideElement(nScrollBtn);
  }
};

function checkInput(element) {
  let newVal = element.value;
  const checkChars = element.value.length >= state.legNumber * config.chunkSize;
  const checkN = newVal.split(/\n/g).length - 1 >= state.legNumber;
  if (checkChars || checkN) {
    insertInputValues();
    element.blur();
  }
}

const gotoMenuPage = () => {
  unhideElement(menuPage);
  hideElement(runPage);
};

const goToStart = () => {
  hideElement(menuPage);
  unhideElement(startPage);
};

const calculateVLines = (number, height, width, startPoint = [0, 0]) => {
  const lines = [];
  let startX = startPoint[0];
  let startY = startPoint[1];
  let endX = startX;
  let endY = startY + height;
  for (let i = 0; i < number; i++) {
    const line = [startX, startY, endX, endY];
    lines.push(line);
    startX += width;
    endX = startX;
  }
  return lines;
};

const getRandomValues = (values, minHLines) => {
  const currentValues = [...values];
  const nextValues = [...values];
  const points = getRndInteger(minHLines, values.length);
  const current = [];
  const next = [];
  for (let i = 0; i < points; i++) {
    let randomIndex = getRndInteger(0, currentValues.length - 1);
    current.push(currentValues.splice(randomIndex, 1)[0]);
    randomIndex = getRndInteger(0, nextValues.length - 1);
    next.push(nextValues.splice(randomIndex, 1)[0]);
  }
  return { current, next };
};

const calculateHLines = (
  vLinesPoints,
  minHLines,
  maxHLines = 8,
  paddingV = 25
) => {
  const minY = vLinesPoints[0][1] + paddingV;
  const maxY = vLinesPoints[0][3] - paddingV;
  const distance = Math.round((maxY - minY) / maxHLines);
  const HLines = [];
  const currentLineYPoints = [];
  const nextLineYPoints = [];
  vLinesPoints.every((vLinePoints, index) => {
    if (index === vLinesPoints.length - 1) return;
    let currentPoints = range(minY, maxY, distance);
    if (index % 2 === 0)
      currentPoints = range(minY + Math.round(distance / 2), maxY, distance);
    let { current, next } = getRandomValues(currentPoints, minHLines);
    current.sort((a, b) => a - b);
    next.sort((a, b) => a - b);
    current.every((val, ind) => {
      HLines.push([vLinePoints[0], val, vLinesPoints[index + 1][0], next[ind]]);
      return true;
    });
    return true;
  });
  return HLines;
};

function range(start, stop, step) {
  var result = [];
  for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i);
  }

  return result;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculatePath(hLinesPoints, vLinesPoints) {
  const paths = [];
  vLinesPoints.every((vLinePoints, index) => {
    const path = [[vLinePoints[0], vLinePoints[1]]];
    let breakPoint = 0;
    while (breakPoint < 100) {
      const contLines = [];
      hLinesPoints.forEach((hLinePoints, ind) => {
        if (hLinePoints[0] === path.at(-1)[0]) {
          if (hLinePoints[1] > path.at(-1)[1]) {
            contLines.push(hLinePoints);
          }
        }
        if (hLinePoints[2] === path.at(-1)[0]) {
          if (hLinePoints[3] > path.at(-1)[1]) {
            contLines.push(hLinePoints);
          }
        }
      });
      if (contLines.length === 0) {
        path.push([path.at(-1)[0], vLinePoints[3]]);
        break;
      }
      const distances = [];
      contLines.forEach((contPoint, ind) => {
        if (contPoint[0] === path.at(-1)[0]) {
          distances.push([contPoint[1] - path.at(-1)[1], ind]);
        } else if (contPoint[2] === path.at(-1)[0]) {
          distances.push([contPoint[3] - path.at(-1)[1], ind]);
        }
      });
      distances.sort((a, b) => a[0] - b[0]);
      const closestHLine = contLines[distances[0][1]];
      let isSameLine;
      if (closestHLine[0] === path.at(-1)[0]) {
        path.push([closestHLine[0], closestHLine[1]]);
        path.push([closestHLine[2], closestHLine[3]]);
        isSameLine = true;
      } else if (closestHLine[2] === path.at(-1)[0]) {
        path.push([closestHLine[2], closestHLine[3]]);
        path.push([closestHLine[0], closestHLine[1]]);
        isSameLine = false;
      }

      breakPoint++;
    }
    paths.push(path);
    return true;
  });

  return paths;
}

function createLeg(
  topValues,
  botValues,
  height = 300,
  minHLines = 2,
  maxHLines = 8,
  distBLines = 100
) {
  const textHeight = 25;
  const padding = 10;
  const totalPaddingForText = (padding + textHeight + padding) * 2;
  const vLineNumbers = topValues.length;
  const lineHeight = height - totalPaddingForText;
  const startPoint = [50, Math.round(totalPaddingForText / 2)];
  const dims = `0,0,${distBLines * vLineNumbers},${height}`;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const TextFontSize = 20;
  const lineSize = `5`;
  const lineColor = "black";
  svg.setAttribute("viewBox", dims);
  svg.setAttribute("class", "svg-leg");
  svg.setAttribute("height", `${height}`);
  svg.setAttribute("width", `${distBLines * topValues.length}`);
  const vLinesPoints = calculateVLines(
    vLineNumbers,
    lineHeight,
    distBLines,
    startPoint
  );
  vLinesPoints.forEach((vLinePoints, index) => {
    let newLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    newLine.setAttribute("id", `V-line-${index}`);
    newLine.setAttribute("x1", `${vLinePoints[0]}`);
    newLine.setAttribute("y1", `${vLinePoints[1]}`);
    newLine.setAttribute("x2", `${vLinePoints[2]}`);
    newLine.setAttribute("y2", `${vLinePoints[3]}`);
    newLine.setAttribute("stroke", lineColor);
    newLine.setAttribute("stroke-width", lineSize);
    svg.appendChild(newLine);
    let newTopText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    newTopText.setAttribute("id", `top-text-${index}`);
    newTopText.setAttribute(
      "x",
      `${
        vLinePoints[0] -
        Math.round(
          (topValues[index].toString().length * Math.round(TextFontSize / 2)) /
            2
        )
      }`
    );
    newTopText.setAttribute("y", `${vLinePoints[1] - padding}`);
    newTopText.setAttribute("class", "leg-text-btn");
    var text = document.createTextNode(`${topValues[index]}`);
    newTopText.appendChild(text);
    svg.appendChild(newTopText);
    let newBottomText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    newBottomText.setAttribute("id", `bottom-text-${index}`);
    newBottomText.setAttribute(
      "x",
      `${
        vLinePoints[0] -
        Math.round(
          (botValues[index].toString().length * Math.round(TextFontSize / 2)) /
            2
        )
      }`
    );
    newBottomText.setAttribute("y", `${vLinePoints[3] + padding + padding}`);
    newBottomText.setAttribute("class", "leg-text-btn");
    var text = document.createTextNode(`${botValues[index]}`);
    newBottomText.appendChild(text);
    svg.appendChild(newBottomText);
  });
  const hLinesPoints = calculateHLines(vLinesPoints, minHLines, maxHLines);
  hLinesPoints.forEach((hLinePoints, index) => {
    let newLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    newLine.setAttribute("id", `H-line-${index}`);
    newLine.setAttribute("x1", `${hLinePoints[0]}`);
    newLine.setAttribute("y1", `${hLinePoints[1]}`);
    newLine.setAttribute("x2", `${hLinePoints[2]}`);
    newLine.setAttribute("y2", `${hLinePoints[3]}`);
    newLine.setAttribute("stroke", lineColor);
    newLine.setAttribute("stroke-width", lineSize);
    svg.appendChild(newLine);
  });
  const pathForLines = calculatePath(hLinesPoints, vLinesPoints);

  return { svg, pathForLines, vLinesPoints };
}

function getSvgPath(path) {
  const lineWidth = `3`;
  let newPolyLine = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polyline"
  );
  newPolyLine.setAttribute("points", path[0]);
  newPolyLine.setAttribute("stroke", "red");
  newPolyLine.setAttribute("fill", "none");
  newPolyLine.setAttribute("stroke-width", lineWidth);
  return newPolyLine;
}

function animatePath(path, element, topLabelIndex, bottomLabelIndex) {
  const highResPoints = [];
  path.forEach((pathPoint, index) => {
    if (index >= path.length - 1) return;
    highResPoints.push(...calcPoints(pathPoint, path[index + 1]));
  });

  let i = 1;
  function myLoop() {
    setTimeout(function () {
      let oldPath = `${element.getAttribute("points")} `;
      let newPath = (oldPath += `${highResPoints[i]}`);
      element.setAttribute("points", newPath);
      i++;
      if (i < highResPoints.length) {
        myLoop();
      } else {
        setColorToFindItem(topLabelIndex, bottomLabelIndex);
      }
    }, 3);
  }

  myLoop();
}

const calcPoints = (point1, point2) => {
  const x1 = point1[0];
  const y1 = point1[1];
  const x2 = point2[0];
  const y2 = point2[1];
  const linePoints = [];
  if (x1 === x2) {
    let x = x1;
    if (y1 < y2) {
      for (let y = y1; y <= y2; y++) {
        linePoints.push([x, y]);
      }
    } else if (y1 > y2) {
      for (let y = y1; y >= y2; y--) {
        linePoints.push([x, y]);
      }
    }
  } else if (y1 === y2) {
    let y = y1;
    if (x1 < x2) {
      for (let x = x1; x <= x2; x++) {
        linePoints.push([x, y]);
      }
    } else if (x1 > x2) {
      for (let x = x1; x >= x2; x--) {
        linePoints.push([x, y]);
      }
    }
  } else if (x1 < x2) {
    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;
    for (let x = x1; x <= x2; x++) {
      const y = Math.round(m * x + b);
      linePoints.push([x, y]);
    }
  } else if (x1 > x2) {
    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;
    for (let x = x1; x >= x2; x--) {
      const y = Math.round(m * x + b);
      linePoints.push([x, y]);
    }
  }

  return linePoints;
};

function setColorToFindItem(topLabelIndex, bottomLabelIndex) {
  let color = runPageLeg.colors[getRndInteger(0, runPageLeg.colors.length - 1)];
  const topLabelElement = document.getElementById(`top-text-${topLabelIndex}`);
  topLabelElement.setAttribute("stroke", color);
  topLabelElement.setAttribute("fill", color);
  const bottomLabeElement = document.getElementById(
    `bottom-text-${bottomLabelIndex}`
  );
  bottomLabeElement.setAttribute("stroke", color);
  bottomLabeElement.setAttribute("fill", color);
}

const createHomeButton = () => {
  const xmlns = "http://www.w3.org/2000/svg";
  const btnContainer = document.createElement("table");
  btnContainer.setAttribute("class", "home-container");
  btnContainer.setAttribute("onclick", "gotoMenuPage()");
  const btnBody = document.createElement("tbody");
  const trBtn = document.createElement("tr");
  const tdTitle = document.createElement("td");
  const btnTitle = document.createElement("h1");
  Object.assign(btnTitle, {
    id: "home-btn-title",
    innerHTML: "Home",
  });
  btnTitle.setAttribute("class", "home-title");
  tdTitle.appendChild(btnTitle);
  const tdIcon = document.createElement("td");
  const btnIcon = document.createElementNS(xmlns, "svg");
  Object.assign(btnIcon, {
    id: "home-btn-icon",
  });
  btnIcon.setAttribute("class", "home-btn");
  btnIcon.setAttribute("viewBox", "0 0 60 60");
  btnIcon.setAttribute("x", "0");
  btnIcon.setAttribute("y", "0");
  btnIcon.innerHTML = `<path style=" stroke-linejoin: round; fill-rule: evenodd; stroke: #333333; stroke-linecap: round; stroke-width: 3.125; fill: #b3b3b3; " d="m55.78 30.357c0.149-14.104-11.187-25.651-25.291-25.8-14.104-0.1491-25.651 11.156-25.8 25.26-0.1491 14.104 11.156 25.682 25.26 25.831s25.682-11.187 25.831-25.291zm-20.208-18.84l-0.145 13.656-0.242 11.092-0.137 12.968-18.613-18.979 19.137-18.737z" sodipodi:stroke-cmyk="(0 0 0 0.8)" />`;
  tdIcon.appendChild(btnIcon);
  trBtn.appendChild(tdIcon);
  trBtn.appendChild(tdTitle);
  btnBody.appendChild(trBtn);
  btnContainer.appendChild(btnBody);
  return btnContainer;
};

const renderRunPage = () => {
  runPage.innerHTML = runPageCopy.innerHTML;
  runPage.classList.remove("hide-element");
  ghostLegCrt = document.getElementById("ghost-leg-container");
  ghostLegCrtCopy = ghostLegCrt.cloneNode();
  const homeBtn = createHomeButton();
  runPage.prepend(homeBtn);
  reGenerate();
};

function createSvg() {
  return createLeg(
    state.topValues,
    state.bottomValues,
    ghostLegCrt.clientHeight - 10
  );
}

const reGenerate = () => {
  ghostLegCrt.innerHTML = ghostLegCrtCopy.innerHTML;
  ghostLegCrt.style.width = `${state.topValues.length * 100}px`;
  const { svg, pathForLines, vLinesPoints } = createSvg();
  runPageLeg.legContainer = svg;
  runPageLeg.path = pathForLines;
  runPageLeg.vLinesPoints = vLinesPoints;
  matchPairs();
  ghostLegCrt.appendChild(runPageLeg.legContainer);
  createEventListersForRunPage();
};

const drawLine = (indexOfValue, isTop) => {
  const oldLines = document.getElementsByTagName("polyline");
  const lineNumber = oldLines.length;
  const pathPoints = [...runPageLeg.path[indexOfValue]];
  if (lineNumber != 0) {
    for (let i = 0; i < lineNumber; i++) {
      runPageLeg.legContainer.removeChild(oldLines[i]);
    }
  }

  const bottomLabelIndex = runPageLeg.vLinesPoints.findIndex((value, index) => {
    return value[0] === pathPoints[pathPoints.length - 1][0];
  });
  const topLabelIndex = indexOfValue;
  if (!isTop) {
    pathPoints.reverse();
  }
  const newSvgPath = getSvgPath(pathPoints);
  runPageLeg.legContainer.appendChild(newSvgPath);
  animatePath(pathPoints, newSvgPath, topLabelIndex, bottomLabelIndex);
};

function createEventListersForRunPage() {
  state.topValues.forEach((topValue, index) => {
    const text = document.getElementById(`top-text-${index}`);
    text.addEventListener("click", () => {
      drawLine(state.results[index][0], true);
    });
  });

  state.bottomValues.forEach((bottomValue, oldIndex) => {
    const text = document.getElementById(`bottom-text-${oldIndex}`);
    text.addEventListener("click", () => {
      let resultIndex;
      state.results.forEach((result, index) => {
        if (result[1] === oldIndex) {
          resultIndex = index;
        }
      });
      drawLine(resultIndex, false);
    });
  });
}

function matchPairs() {
  state.results = [];
  let results = [];
  runPageLeg.path.forEach((path, index) => {
    results.push([path[0][0], path.at(-1)[0]]);
  });
  let resVal = [];
  results.forEach((result1, index1) => {
    let top = index1;
    let bot = 0;
    results.forEach((result2, index2) => {
      if (result1[1] === result2[0]) {
        bot = index2;
      }
    });
    resVal.push([top, bot]);
  });
  state.results = resVal;
}

function renderResultPage() {
  resultPage.innerHTML = resultPageCopy.innerHTML;
  resultPage.classList.remove("hide-element");
  resultContainer = document.getElementById("results");
  showTheResult();
}

function showTheResult() {
  const table = document.createElement("div");
  table.setAttribute("class", "result-table-grid");
  state.results.forEach((result, index) => {
    const resultField = document.createElement("div");
    resultField.setAttribute("class", "result-field");
    const resultText = document.createElement("h1");
    resultText.setAttribute("class", "result-text");
    resultText.innerHTML = `${index + 1}. ${state.topValues[result[0]]} -> ${
      state.bottomValues[result[1]]
    }`;
    resultField.appendChild(resultText);
    table.appendChild(resultField);
  });
  resultContainer.appendChild(table);
}

function gotoResult() {
  hideElement(runPage);
  renderResultPage();
}

function restart() {
  init();
}

init();
