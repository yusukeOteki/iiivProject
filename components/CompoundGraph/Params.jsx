/*jshint esversion: 6 */

// colors for plot
const colors = [
  "#ff0f0f", "#0fafff", "#ff0faf", "#0fff0f", "#ffaf00", "#00ffaf", "#af00ff", "#00f0ff",
  "#ee4721", "#0050a8", "#dd0ff0", "#88dd8d", "#ff9a66", "#009944", "#f0aa88", "#00ada9",
  "#aa0012", "#0f0fff", "#e87798", "#00a055", "#f7c488", "#affff0", "#814721", "#5079c2",
  "#f55f5a", "#0ffff0", "#aa79c2", "#afdd0f", "#aaaa00", "#507744", "#522886", "#9caeb7",
  "#88008d"
];
// variety of y axis
const ylabels = ["Eg", "CBO", "VBO", "CB", "VB", "C2V"];
const xlabels = ["Lattice constant [A]", "Lattice mismatch [%]"];

// variety of compounds
const compounds = {
  "AlGaAsSb": { "x": "Al", "y": "As" }, "AlInAsSb": { "x": "Al", "y": "As" }, "GaInAsSb": { "x": "Ga", "y": "As" },
  "AlGaInAs": { "x": "Al", "y": "Ga" }, "AlGaInSb": { "x": "Al", "y": "Ga" },
  "AlPAsSb": { "x": "P", "y": "As" }, "GaPAsSb": { "x": "P", "y": "As" }, "InPAsSb": { "x": "P", "y": "As" },
  "AlGaPSb": { "x": "Al", "y": "P" }, "AlInPSb": { "x": "Al", "y": "P" }, "GaInPSb": { "x": "Ga", "y": "P" },
  "AlGaPAs": { "x": "Al", "y": "P" }, "AlInPAs": { "x": "Al", "y": "P" }, "GaInPAs": { "x": "Ga", "y": "P" },
  "AlGaInP": { "x": "Al", "y": "Ga" },
  "AlGaAs": { "x": "Al" }, "AlInAs": { "x": "Al" }, "GaInAs": { "x": "Ga" },
  "AlGaSb": { "x": "Al" }, "AlInSb": { "x": "Al" }, "GaInSb": { "x": "Ga" },
  "AlAsSb": { "x": "As" }, "GaAsSb": { "x": "As" }, "InAsSb": { "x": "As" },
  "AlGaP": { "x": "Al" }, "AlInP": { "x": "Al" }, "GaInP": { "x": "Ga" },
  "AlPSb": { "x": "P" }, "GaPSb": { "x": "P" }, "InPSb": { "x": "P" },
  "AlPAs": { "x": "P" }, "GaPAs": { "x": "P" }, "InPAs": { "x": "P" },
  "GaAs": {}, "InAs": {}, "AlAs": {},
  "GaSb": {}, "InSb": {}, "AlSb": {},
  "InP": {}, "GaP": {}, "AlP": {},
};


// setting initial raws of compounds fun.
const compound_data = (() => {
  let compound_data = {};
  for (let compound in compounds) (compound_data[compound] = require('../../constants/compounds/' + compound + '.json'));
  return compound_data;
})();

// setting initial max and min of fractions of compounds
const compounds_fractions = (() => {
  let compounds_fractions_temp = {};
  for (let key in compound_data) {
    compounds_fractions_temp[key] = {
      'x': (compound_data[key][0].x === null) ? null : 10,
      'xMin': (compound_data[key][0].x === null) ? null : 0,
      'xMax': (compound_data[key][0].x === null) ? null : 100,
      'y': (compound_data[key][0].y === null) ? null : 10,
      'yMin': (compound_data[key][0].y === null) ? null : 0,
      'yMax': (compound_data[key][0].y === null) ? null : 100,
      'z': (compound_data[key][0].z === null) ? null : 10,
      'zMin': (compound_data[key][0].z === null) ? null : 0,
      'zMax': (compound_data[key][0].z === null) ? null : 100
    };
  }
  return compounds_fractions_temp;
})();

// updating indicating data
const setGraphData = (mode, temp_compounds_checked, fraction, base_a) => {
  let [temp_raws, temp_compound_raws, temp_binaries_raws, temp_compound_raws_C2V, directs] = [[], [], [], [], [], []];

  for (let i in temp_compounds_checked) {
    temp_compound_raws[i] = compound_data[temp_compounds_checked[i]].filter(checked_compound => {
      if (checked_compound.x === null)
        return checked_compound;
      else if ((checked_compound.y === null) &&
        (parseInt(checked_compound.x, 10) % parseInt(fraction[checked_compound.compound].x, 10) === 0) &&
        ((fraction[checked_compound.compound].xMin <= checked_compound.x) &&
          (checked_compound.x <= fraction[checked_compound.compound].xMax)))
        return checked_compound;
      else if ((parseInt(checked_compound.x, 10) % parseInt(fraction[checked_compound.compound].x, 10) === 0) &&
        (parseInt(checked_compound.y, 10) % parseInt(fraction[checked_compound.compound].y, 10) === 0) &&
        ((fraction[checked_compound.compound].xMin <= checked_compound.x) &&
          (checked_compound.x <= fraction[checked_compound.compound].xMax)) &&
        ((fraction[checked_compound.compound].yMin <= checked_compound.y) &&
          (checked_compound.y <= fraction[checked_compound.compound].yMax)))
        return checked_compound;
      else
        return '';
    });

    if (mode === 'C2V') {
      let temp_compound_raws_C2V_temp = [];
      for (let j in temp_compound_raws[i]) {
        let [temp_C2V_CB, temp_C2V_VB] = [JSON.parse(JSON.stringify(temp_compound_raws[i][j])), JSON.parse(JSON.stringify(temp_compound_raws[i][j]))];
        [temp_C2V_CB.C2V, temp_C2V_VB.C2V] = [temp_C2V_CB.CB, temp_C2V_VB.VB];
        temp_compound_raws_C2V_temp.push(temp_C2V_CB, temp_C2V_VB);
        temp_raws.push(temp_C2V_CB, temp_C2V_VB);
      }
      temp_compound_raws_C2V.push(temp_compound_raws_C2V_temp);
    } else {
      for (let j in temp_compound_raws[i])
        temp_raws.push(temp_compound_raws[i][j]);
    }
  }

  temp_raws.map(raws => {
    raws.p = base_a > 0 ? (raws.a - base_a) / base_a * 100 : raws.a
  })

  Object.keys(compounds).map(binary =>
    (!Object.keys(compounds[binary]).length) &&
    temp_raws.map((temp_raw, i) =>
      (temp_raw.latex === binary) &&
      (temp_binaries_raws.push(temp_raw))
    )
  );

  let temp_compound_raws_temp = mode === 'C2V' ? temp_compound_raws_C2V : temp_compound_raws;
  for (let j in temp_compound_raws_temp) {
    let [direct, indirect] = [[], []];
    for (let k in temp_compound_raws_temp[j])
      temp_compound_raws_temp[j][k].direct ? direct.push(temp_compound_raws_temp[j][k]) : indirect.push(temp_compound_raws_temp[j][k]);
    direct.length && directs.push(direct);
    indirect.length && directs.push(indirect);
  }
  return [temp_raws, directs, temp_binaries_raws];
};

const applyFilter = (compound_raws, binaries_data, filter) =>
  [
    JSON.parse(JSON.stringify(compound_raws)).map(list => list.filter(item =>
      (filter.a_min.on ? (filter.a_min.value <= item.a && item.a <= filter.a_max.value) : true) &&
      (filter.Eg_min.on ? (filter.Eg_min.value <= item.Eg && item.Eg <= filter.Eg_max.value) : true) &&
      (filter.CB_min.on ? (filter.CB_min.value <= item.CB && item.CB <= filter.CB_max.value) : true) &&
      (filter.VB_min.on ? (filter.VB_min.value <= item.VB && item.VB <= filter.VB_max.value) : true) &&
      (filter.direct_only.on ? (item.direct === 1) : true) &&
      (filter.indirect_only.on ? (item.direct === 0) : true)
    )),
    JSON.parse(JSON.stringify(binaries_data)).filter(list =>
      (filter.a_min.on ? (filter.a_min.value <= list.a && list.a <= filter.a_max.value) : true) &&
      (filter.Eg_min.on ? (filter.Eg_min.value <= list.Eg && list.Eg <= filter.Eg_max.value) : true) &&
      (filter.CB_min.on ? (filter.CB_min.value <= list.CB && list.CB <= filter.CB_max.value) : true) &&
      (filter.VB_min.on ? (filter.VB_min.value <= list.VB && list.VB <= filter.VB_max.value) : true) &&
      (filter.direct_only.on ? (list.direct === 1) : true) &&
      (filter.indirect_only.on ? (list.direct === 0) : true)
    )
  ]

const getGraphRange = (data, xAxis, yAxis) =>
  [
    parseInt((Math.min.apply(null, data.map(o => o[xAxis])) - 0.01) * 1000, 10) / 1000,
    parseInt((Math.max.apply(null, data.map(o => o[xAxis])) + 0.01) * 1000, 10) / 1000,
    Math.floor(parseInt((Math.min.apply(null, data.map(o => o[yAxis])) - 0.01) * 1000, 10) / 1000),
    Math.ceil(parseInt((Math.max.apply(null, data.map(o => o[yAxis])) + 0.01) * 1000, 10) / 1000)
  ]

const flatten = function (ary) {
  return ary.reduce(function (p, c) {
    return Array.isArray(c) ? p.concat(flatten(c)) : p.concat(c);
  }, []);
};

/*
import axios from 'axios';
let carr = Object.entries(compounds).map(([key, value]) => ({'key': key, 'value': value}))
function postData(key, t) {
  const instance = axios.create({
    baseURL: 'http://localhost:8000/',
    timeout: 300000
  });
  let params = new URLSearchParams();
  params.append('compound', key);
  params.append('temperature', t);
  params.append('xFrom', 0);
  params.append('xTo', 100);
  params.append('xStep', 1);
  params.append('yFrom', 0);
  params.append('yTo', 100);
  params.append('yStep', 1);
  return instance.post('/',params,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
                 .then(response => response.data)
                 .catch(err => console.log('err:', err));
}

function postData_wrapper(carr, i, t) {
  --i;
  if (i < 0) {
    return Promise.resolve(compounds_temp);
  } else {
    return postData(carr[i].key, t)
    .then(n => {
      compounds_temp[carr[i].key] = n.result;
      return postData_wrapper(carr, i, t);
    })
    .catch(e => console.log(e));
  }
}

let compounds_temp = {}
console.log('start');
postData_wrapper(carr, carr.length, 3000).then(num => console.log(compounds_temp));
*/

export { colors, xlabels, ylabels, compounds, compound_data, compounds_fractions, applyFilter, setGraphData, getGraphRange }
