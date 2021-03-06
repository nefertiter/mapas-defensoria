import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout";
import { useAuth } from "../../components/Auth";
import { Table } from "../../components/DataTable";
import { table } from "../../data/users";

const UsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  let auth = useAuth();

  useEffect(() => {
    if (loading) {
      axios.get(`https://defensoria-sf.web.app/api/v1/users`).then((res) => {
        const users = res.data;
        setItems(users);
        setLoading(false);
      });
    }
  }, [loading]);

  const onDelete = (uid) => {
    if (uid === auth.user.uid) {
      alert("No puedes eliminarte a ti mismo");
      return false;
    }
    if (window.confirm("Seguro quiere eliminar al usuario?")) {
      axios
        .delete(`https://defensoria-sf.web.app/api/v1/users/${uid}`)
        .then((res) => {
          setLoading(true);
        });
    }
  };

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
          </div>
        </div>
        <div className="w-full overflow-hidden rounded-lg shadow-xs">
          {/*  Table  */}
          {!loading && (
            <Table
              loading={loading}
              items={items}
              table={table}
              onDelete={onDelete}
            ></Table>
          )}
          {/* Table End */}
        </div>
      </div>
    </Layout>
  );
};
export default UsersPage;
