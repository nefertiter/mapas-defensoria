import React, { useState, useEffect } from "react";
import Map from "./Map";
import { Layers, TileLayer, VectorLayer } from "./Layers";
import { Style, Icon } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import axios from "axios";
import { osm, vector } from "./Source";
import { fromLonLat, get } from "ol/proj";
import { Controls, FullScreenControl } from "./Controls";

import logo from "./assets/images/logo.svg";
import { firebase_app } from "./firebase";
import mapConfig from "./config.json";

function addMarkers(lonLatArray) {
  var iconStyle = new Style({
    image: new Icon({
      anchorXUnits: "fraction",
      anchorYUnits: "pixels",
      src: mapConfig.markerImage32,
    }),
  });
  let features = lonLatArray.map(item => {
    let feature = new Feature({
      geometry: new Point(fromLonLat(item)),
    });
    feature.setStyle(iconStyle);
    return feature;
  });
  return features;
}
const FullMap = ({ list }) => {
  const [center, setCenter] = useState(mapConfig.center);
  const [zoom, setZoom] = useState(7);
  const [features, setFeatures] = useState(addMarkers(list));

  return (
    <Map center={fromLonLat(center)} zoom={zoom}>
      <Layers>
        <TileLayer source={osm()} zIndex={0} />
        <VectorLayer source={vector({ features })} />
      </Layers>
      <Controls>
        <FullScreenControl />
      </Controls>
    </Map>
  );
};
function App() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  let list = [];
  const [featuresList, setFeaturesList] = useState([]);
  useEffect(() => {
    if (loading) {
      axios.get(`https://defensoria-sf.web.app/api/v1/categories`).then(res => {
        const cats = res.data;
        setCategories(Object.values(cats.categories));
        setLoading(false);
      });
      firebase_app
        .firestore()
        .collection("points")
        .limit(40)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const item = {
              id: doc.id,
              ...doc.data(),
            };
            if (
              item.latitud &&
              item.longitude &&
              typeof item.latitud === "string"
            ) {
              list.push([
                parseFloat(item.longitude.replace(",", ".")),
                parseFloat(item.latitud.replace(",", ".")),
              ]);
            } else {
              console.log("wrong data", doc.id, item.latitud, item.longitude);
            }
          });
          // setItems(newArray);

          // console.log(newArray);
          setLoading(false);
          setFeaturesList(list);
          // setFeatures(addMarkers(featuresList));
        })
        .catch(error => {
          console.log("Error getting document:", error);
        });
    }
  }, [loading]);
  return (
    <div>
      <header
        style={{ borderColor: "#afc75d" }}
        className="border-b-4 py-4 bg-white"
      >
        <div className="container mx-auto">
          <div className="flex flex-row items-center justify-between">
            <div>
              <img
                src={logo}
                alt="Defensor&iacute;a de ni&ntilde;as, ni&ntilde;os y adolescentes"
              />
            </div>
            <div>
              <h1 className="text-2xl">Georeferencia Servicios Locales</h1>
            </div>
          </div>
        </div>
      </header>
      <main className="py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <ul className="space-y-2">
                {categories.map((item, index) => {
                  // const checked = item.checked || false;
                  let displaySub = item.checked || false;
                  return (
                    <li className="text-sm " key={`cat-${index}`}>
                      <label className="bg-gray-100 border rounded-lg p-2 text-black block space-x-3 flex items-center">
                        <input
                          type="checkbox"
                          name="category"
                          checked={item.checked}
                          onClick={ev => {
                            const newArray = categories;
                            newArray[index] = {
                              ...item,
                              checked: ev.target.checked,
                            };
                            if (ev.target.checked) displaySub = true;
                            setCategories(newArray);
                          }}
                        />
                        <span>{item.name}</span>
                      </label>
                      {item.children && (
                        <div>
                          {item.children.map(child => {
                            return (
                              <label className="bg-white block  text-xs border rounded-lg  py-2 px-4 my-0.5  space-x-3 flex items-center ">
                                {" "}
                                <input type="checkbox" name="category" />
                                <span>{child.text}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="col-span-3">
              <div
                id="mapa-santa-fe"
                className="w-full"
                style={{ height: 500 }}
              >
                {!loading && featuresList.length > 0 && (
                  <FullMap list={featuresList}></FullMap>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer
        className=" bg-white py-16 border-t-4"
        style={{ borderColor: "#afc75d" }}
      >
        <div className="container space-y-5">
          <div className="grid text-gray-800 text-sm md:grid-cols-2">
            <div>
              <h3 className="font-bold text-xl">ROSARIO</h3>
              <p>Tucumán 1681 - CP 2000 - Rosario</p>
              <p>
                Teléfonos: Lunes a viernes de 8.00 a 18.00 (0341) 156-914345
              </p>
              <p>info@defensorianna.gob.ar</p>
            </div>
            <div>
              <h3 className="font-bold text-xl">SANTA FE</h3>
              <p>Eva Perón 2726 - CP 3000 - Santa Fe</p>
              <p>
                Teléfonos: Lunes a viernes de 8.00 a 18.00 (0342) 154-494569
              </p>
              <p>info@defensorianna.gob.ar</p>
            </div>
          </div>
          <div className="grid text-gray-800 text-sm md:grid-cols-3 border-t  pt-5">
            <div>
              <h3 className="font-bold text-xl">RAFAELA</h3>
              <p>Brown 73</p>
              <p>Teléfonos: (03492) 45-3101</p>
              <p>defensorrafaela@gmail.com</p>
            </div>
            <div>
              <h3 className="font-bold text-xl">RECONQUISTA</h3>
              <p>Patricio Diez 985</p>
              <p>Teléfonos: (03482) 43-8849</p>
              <p>reconquista@defensorsantafe.gov.ar</p>
            </div>
            <div>
              <h3 className="font-bold text-xl">VENADO TUERTO</h3>
              <p>9 de julio 1040</p>
              <p>Teléfonos: (03462) 40-8868</p>
              <p>venadotuerto@defensorsantafe.gov.ar</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
