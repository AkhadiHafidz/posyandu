"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/header";

import BalitaTable from "@/components/balita/BalitaTable";
import TambahBalitaModal from "@/components/balita/TambahBalitaModal";
import DetailBalitaModal from "@/components/balita/DetailBalitaModal";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function BalitaPage() {

  // =========================
  // STATE DATA
  // =========================
  const [dataBalita, setDataBalita] =
    useState<any[]>([]);

  // =========================
  // FORM STATE
  // =========================
  const [nama, setNama] =
    useState("");

  const [umur, setUmur] =
    useState("");

  const [jenisKelamin,
    setJenisKelamin] =
    useState("");

  const [alamat, setAlamat] =
    useState("");

  // =========================
  // EDIT
  // =========================
  const [editId, setEditId] =
    useState<string | null>(null);

  // =========================
  // DETAIL
  // =========================
  const [detailData,
    setDetailData] =
    useState<any>(null);

  // =========================
  // MODAL
  // =========================
  const [openForm,
    setOpenForm] =
    useState(false);

  const [openDetail,
    setOpenDetail] =
    useState(false);

  // =========================
  // GET DATA
  // =========================
  const getData = async () => {

    const querySnapshot =
      await getDocs(
        collection(db, "balita")
      );

    const data: any[] = [];

    querySnapshot.forEach((docItem) => {

      data.push({
        id: docItem.id,
        ...docItem.data(),
      });

    });

    setDataBalita(data);
  };

  useEffect(() => {
    getData();
  }, []);

  // =========================
  // TAMBAH / UPDATE
  // =========================
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    // VALIDASI
    if (
      !nama ||
      !umur ||
      !jenisKelamin ||
      !alamat
    ) {
      alert("Semua field wajib diisi");
      return;
    }

    try {

      // UPDATE
      if (editId) {

        const docRef = doc(
          db,
          "balita",
          editId
        );

        await updateDoc(docRef, {
          nama,
          umur,
          jenisKelamin,
          alamat,
        });

        alert("Data berhasil diupdate");

      } else {

        // TAMBAH
        await addDoc(
          collection(db, "balita"),
          {
            nama,
            umur,
            jenisKelamin,
            alamat,
            createdAt: new Date(),
          }
        );

        alert("Data berhasil ditambahkan");
      }

      // RESET
      setNama("");
      setUmur("");
      setJenisKelamin("");
      setAlamat("");

      setEditId(null);

      setOpenForm(false);

      getData();

    } catch (error) {

      console.log(error);

      alert("Terjadi kesalahan");
    }
  };

  // =========================
  // HAPUS
  // =========================
  const handleDelete = async (
    id: string
  ) => {

    const confirmDelete =
      confirm(
        "Yakin ingin menghapus data?"
      );

    if (!confirmDelete) return;

    try {

      await deleteDoc(
        doc(db, "balita", id)
      );

      alert("Data berhasil dihapus");

      getData();

    } catch (error) {

      console.log(error);

      alert("Gagal menghapus data");
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = async (
    id: string
  ) => {

    try {

      const docRef = doc(
        db,
        "balita",
        id
      );

      const docSnap =
        await getDoc(docRef);

      if (docSnap.exists()) {

        const data: any =
          docSnap.data();

        setNama(data.nama);
        setUmur(data.umur);

        setJenisKelamin(
          data.jenisKelamin
        );

        setAlamat(data.alamat);

        setEditId(id);

        setOpenForm(true);
      }

    } catch (error) {

      console.log(error);

      alert("Gagal mengambil data");
    }
  };

  // =========================
  // DETAIL
  // =========================
  const handleDetail = async (
    id: string
  ) => {

    try {

      const docRef = doc(
        db,
        "balita",
        id
      );

      const docSnap =
        await getDoc(docRef);

      if (docSnap.exists()) {

        setDetailData(
          docSnap.data()
        );

        setOpenDetail(true);
      }

    } catch (error) {

      console.log(error);

      alert("Gagal mengambil detail");
    }
  };

  return (
    <div className="flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <div className="flex flex-col flex-1">

        {/* NAVBAR */}
        <Navbar />

        {/* MAIN */}
        <main className="p-6 bg-gray-100 min-h-screen">

          <div className="flex flex-col gap-6">

            {/* TITLE */}
            <div>

              <h1 className="text-2xl font-bold text-gray-800">
                Data Balita
              </h1>

              <p className="text-sm text-gray-500">
                Daftar data balita posyandu
              </p>

            </div>

            {/* CARD */}
            <div className="bg-white p-6 rounded-xl shadow">

              {/* HEADER */}
              <div className="flex justify-between items-center mb-5">

                <h2 className="text-lg font-semibold text-gray-800">
                  Daftar Balita
                </h2>

                {/* BUTTON */}
                <button
                  onClick={() => {

                    setOpenForm(true);

                    setEditId(null);

                    setNama("");
                    setUmur("");
                    setJenisKelamin("");
                    setAlamat("");

                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  + Tambah Balita
                </button>

              </div>

              {/* TABLE */}
              <BalitaTable
                dataBalita={dataBalita}
                handleDetail={handleDetail}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />

            </div>

          </div>

        </main>

      </div>

      {/* MODAL FORM */}
      <TambahBalitaModal
        openForm={openForm}
        setOpenForm={setOpenForm}
        handleSubmit={handleSubmit}
        nama={nama}
        setNama={setNama}
        umur={umur}
        setUmur={setUmur}
        jenisKelamin={jenisKelamin}
        setJenisKelamin={setJenisKelamin}
        alamat={alamat}
        setAlamat={setAlamat}
        editId={editId}
      />

      {/* MODAL DETAIL */}
      <DetailBalitaModal
        openDetail={openDetail}
        setOpenDetail={setOpenDetail}
        detailData={detailData}
      />

    </div>
  );
}