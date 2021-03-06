import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout";
import { DataTable } from "../../components/DataTable";
import { firebase_app } from "../../firebase";
import { table } from "../../data/points";

const PointsPage = () => {
  const [reload, setReload] = useState(null);
  const [updating, setUpdating] = useState(false);
  const onDelete = async uid => {
    if (window.confirm("Seguro quiere eliminar la institucion?")) {
      await firebase_app
        .firestore()
        .collection(table.collection)
        .doc(uid)
        .delete();
      window.location.reload();
    }
  };
  const filterElements = table.filters;
  return (
    <Layout>
      <div className="container px-6 mx-auto grid">
        <div className="flex justify-between my-6">
          <h2 className=" text-2xl font-semibold text-gray-700 dark:text-gray-200">
            {table.label}
          </h2>
          <div className="space-x-2">
            <Link
              to={`/${table.collection}/new`}
              className="p-2 bg-red-500 inline rounded text-white text-sm"
            >
              Agregar
            </Link>
            <Link
              to={`/${table.collection}/import`}
              className="p-2 bg-green-500 inline rounded text-white text-sm"
            >
              Importar Archivo
            </Link>

            <button
              onClick={ev => {
                ev.preventDefault();
                if (!updating) {
                  setUpdating(true);
                  axios
                    .get(`https://defensoria-sf.web.app/api/v1/updateStorage`)
                    .then(data => {
                      setUpdating(false);
                    });
                }
              }}
              className={`p-2 ${
                updating ? `bg-gray-500` : `bg-orange-500`
              } inline rounded text-white text-sm`}
            >
              {updating ? `Actualizando...` : `Actualizar Publico`}
            </button>
          </div>
        </div>
        <div
          className="block text-sm text-left text-gray-600 bg-gray-200 border border-gray-400 h-12 flex items-center p-4 rounded-sm my-4"
          role="alert"
        >
          Registros importados pueden demorar entre 5-15 minutos estar
          disponibles.
        </div>
        <div className="w-full overflow-hidden rounded-lg shadow-xs">
          <DataTable
            table={table}
            onDelete={onDelete}
            reload={reload}
            filterElements={filterElements}
          ></DataTable>
        </div>
      </div>
    </Layout>
  );
};
export default PointsPage;
