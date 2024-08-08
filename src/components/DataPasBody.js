import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";

function DataPasBody({ nama, nip, unit }) {
  const columnsPasTerbitStoplist = [
    {
      name: "ID",
      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {row.pendaftaran_id}
        </div>
      ),
    },
    {
      name: "Pas Terbit",
      selector: (row) => row.pas_terbit,
      sortable: true,
    },
    {
      name: "Pas Aktif",
      selector: (row) => row.pas_aktif,
      sortable: true,
    },
    {
      name: "Status Stoplist",
      selector: (row) => row.status_stoplist,
      sortable: true,
    },
    {
      name: "Pas Status",
      selector: (row) => row.pas_status,
      sortable: true,
    },
    {
      name: "Pas Number",
      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {row.pas_number}
        </div>
      ),
    },
    {
      name: "Pas Expired Date",
      selector: (row) => row.pas_expired_date,
      sortable: true,
    },
    {
      name: "Kode Area",
      selector: (row) => row.kode_area,
      sortable: true,
    },
    {
      name: "Nama Instansi",
      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {row.instansi_name}
        </div>
      ),
    },
    {
      name: "Nama Lengkap",
      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {row.nama_lengkap}
        </div>
      ),
    },
    {
      name: "Kode Epc",
      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {row.kode_epc}
        </div>
      ),
    },
    {
      name: "Pas Foto",
      cell: (row) => (
        <img
          width={50}
          height={50}
          src={row.pas_photo}
          alt={row.nama_lengkap}
        />
      ),
    },
  ];

  const columnsPasBlacklist = [
    {
      name: "ID",
      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {row.pendaftaran_id}
        </div>
      ),
    },
    {
      name: "Pas Terbit",
      selector: (row) => row.pas_terbit,
      sortable: true,
    },
    {
      name: "Pas Aktif",
      selector: (row) => row.pas_aktif,
      sortable: true,
    },
    {
      name: "Pas Status",
      selector: (row) => row.pas_status,
      sortable: true,
    },
    {
      name: "Pas Number",
      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {row.pas_number}
        </div>
      ),
    },
    {
      name: "Pas Expired Date",
      selector: (row) => row.pas_expired_date,
      sortable: true,
    },
    {
      name: "Kode Area",
      selector: (row) => row.kode_area,
      sortable: true,
    },
    {
      name: "Nama Instansi",
      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {row.instansi_name}
        </div>
      ),
    },
    {
      name: "Nama Lengkap",
      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {row.nama_lengkap}
        </div>
      ),
    },
    {
      name: "Kode Epc",
      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {row.kode_epc}
        </div>
      ),
    },
    {
      name: "Pas Foto",
      selector: (row) => (
        <img
          width={50}
          height={50}
          src={row.pas_photo}
          alt={row.nama_lengkap}
        />
      ),
    },
    {
      name: "Findings Notes",
      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {row.findings_notes}
        </div>
      ),
    },
  ];

  const [filterPas, setFilterPas] = useState([]);
  const [filterPasBlacklist, setFilterPasBlacklist] = useState([]);
  const [filterPasStoplist, setFilterPasStoplist] = useState([]);

  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [columns, setColumns] = useState([]);

  const fetchDbStatus = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/databaseLogs"
      );
      setDbStatus(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + "/pas");
      setData(response.data);
      setSelectedTable("Pas Terbit");
      setColumns(columnsPasTerbitStoplist);
      setFilterPas(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchDataStoplist = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/pas/stoplist"
      );
      setFilterPasStoplist(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchDataBlacklist = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/pas/blacklist"
      );
      setFilterPasBlacklist(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchDbStatus();
    fetchData();
    fetchDataStoplist();
    fetchDataBlacklist();
  }, [loading]);

  const handleUpdateDatabase = async () => {
    try {
      setLoading(true);

      // Mengirim permintaan ke API
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/databaseUpdate"
      );

      // Menangani respons dari API jika perlu
      console.log("Respons dari API:", response.data);

      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const exportToPdf = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const headers = [
      [
        "Pendaftaran ID",
        "Pas Terbit",
        "Pas Aktif",
        "Pas Status",
        "Pas Number",
        "Pas Expired Date",
        "Kode Area",
        "Instansi Name",
        "Nama Lengkap",
        "Kode Epc",
        "Pas Photo",
      ],
    ];

    const numColumns = 12;
    const pageWidth = doc.internal.pageSize.getWidth();
    const cellWidth = pageWidth / numColumns;

    // Add title
    let title = "Data Pas"; // Default title
    if (selectedTable === "Pas Terbit") {
      title = "Pas Terbit";
    } else if (selectedTable === "Pas Stoplist") {
      title = "Pas Stoplist";
    } else if (selectedTable === "Pas Blacklist") {
      title = "Pas Blacklist";
    } else {
      title = "Data Pas";
    }
    const titleFontSize = 14;
    const titlePositionX = pageWidth / 2; // Centered horizontally
    const titlePositionY = 70; // Vertical position of the title
    doc.setFont("Cambria");
    doc.setFontSize(titleFontSize);
    doc.text(title, titlePositionX, titlePositionY, { align: "center" });

    // Add logo
    const logoUrl = "ap_logo.png";
    const logoWidth = 115;
    const logoHeight = 33;
    const logoPositionX = pageWidth - logoWidth - 37; // Move logo to the left
    const logoPositionY = 25;
    doc.addImage(
      logoUrl,
      "PNG",
      logoPositionX,
      logoPositionY,
      logoWidth,
      logoHeight
    );

    // Determine table position
    const tableStartY = logoPositionY + logoHeight + 30; // Vertical distance between logo and table

    // Function to add image to cell
    const addImageToCell = (dataURI, cell) => {
      const imgWidth = 25;
      const imgHeight = 25;
      doc.addImage(
        dataURI,
        "JPEG",
        cell.x + 2,
        cell.y + 2,
        imgWidth,
        imgHeight
      );
    };

    doc.autoTable({
      startY: tableStartY,
      head: headers,
      body: data.map((item) => {
        // Filter out specified keys and transform the "pas_photo" key
        return Object.entries(item)
          .filter(
            ([key]) =>
              key !== "kode_kartu" &&
              key !== "pas_expired_value" &&
              key !== "pas_photo_link" &&
              key !== "status_stoplist" &&
              key !== "blacklist_st" &&
              key !== "findings_notes" &&
              key !== "findings_date"
          )
          .map(([key, value]) => {
            if (key === "pas_photo") {
              if (value) {
                // Check if pas_photo value exists
                return { content: "", image: value }; // Adjust based on your PDF library's requirements
              } else {
                return { content: "No Image Available", image: null }; // Handle missing photo case
              }
            } else {
              return value; // Maintain data structure
            }
          });
      }),
      didParseCell: (data) => {
        data.cell.styles.fontSize = 8; // Set font size for all cells
        data.cell.styles.cellPadding = 1.5; // Set padding for all cells
      },
      columnStyles: {
        0: { cellWidth: cellWidth },
        1: { cellWidth: cellWidth },
        2: { cellWidth: cellWidth },
        3: { cellWidth: cellWidth },
        4: { cellWidth: cellWidth },
        5: { cellWidth: cellWidth },
        6: { cellWidth: cellWidth },
        7: { cellWidth: cellWidth },
        8: { cellWidth: cellWidth },
        9: { cellWidth: cellWidth },
        10: { cellWidth: cellWidth },
      },
      didDrawCell: (data) => {
        // If the cell contains an image, add the image to the cell
        if (
          data.row.index >= 0 &&
          data.column.index === 10 &&
          data.cell.raw.image
        ) {
          addImageToCell(data.cell.raw.image, data.cell);
        }
      },
    });

    doc.save("data_pas.pdf");
  };

  const handleFilterPas = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    let filteredPas = filterPas;

    filteredPas = filterPas.filter((row) => {
      return Object.entries(row).some(
        ([key, value]) =>
          key !== "pas_photo" &&
          key !== "pas_photo_link" &&
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm)
      );
    });

    // Ubah objek kembali menjadi array untuk ditampilkan di tabel
    const newData = Object.values(filteredPas);
    setData(newData);
  };

  const handleFilterPasTerbit = () => {
    setData(filterPas);
    setSelectedTable("Pas Terbit");
    setColumns(columnsPasTerbitStoplist);
  };

  const handleFilterPasStoplist = () => {
    setData(filterPasStoplist);
    setSelectedTable("Pas Stoplist");
    setColumns(columnsPasTerbitStoplist);
  };

  const handleFilterPasBlacklist = () => {
    setData(filterPasBlacklist);
    setSelectedTable("Pas Blacklist");
    setColumns(columnsPasBlacklist);
  };

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Data Pas Bandara</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item active">Data Pas Bandara</li>
              </ol>
            </div>
            {/* /.col */}
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </div>
      {/* /.content-header */}
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div
                  className="card-body overflow-auto"
                  style={{ maxHeight: "100vh" }}
                >
                  <div className="d-flex flex-row">
                    <div className="m-2">
                      <button
                        className="btn btn-primary mr-auto"
                        onClick={exportToPdf}
                      >
                        Export to PDF
                      </button>
                    </div>
                    {unit === "Admin" && (
                      <div className="m-2">
                        <button
                          className="btn btn-primary"
                          onClick={handleUpdateDatabase}
                          disabled={loading}
                        >
                          {loading ? "Memproses..." : "Update Database"}
                        </button>
                      </div>
                    )}
                    <div className="mt-3 ml-1">
                      <ul className="list-inline">
                        <li className="list-inline-item">Last Updated :</li>
                        {dbStatus ? (
                          <li className="list-inline-item">
                            {dbStatus[0].event_time}
                          </li>
                        ) : (
                          <li className="list-inline-item text-muted">
                            {" "}
                            Loading...
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className="dropdown m-2">
                      <button
                        className="btn btn-info dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {selectedTable || "Filter Table"}
                      </button>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <a
                          className="dropdown-item"
                          onClick={handleFilterPasTerbit}
                          href="#"
                        >
                          Pas Terbit
                        </a>
                        <a
                          className="dropdown-item"
                          onClick={handleFilterPasStoplist}
                          href="#"
                        >
                          Pas Stoplist
                        </a>
                        <a
                          className="dropdown-item"
                          onClick={handleFilterPasBlacklist}
                          href="#"
                        >
                          Pas Blacklist
                        </a>
                      </div>
                    </div>
                    <div className="ml-auto p-2">
                      <input
                        className="px-2 py-1"
                        type="text"
                        placeholder="Search..."
                        onChange={handleFilterPas}
                      />
                    </div>
                  </div>
                  {data.length > 0 ? (
                    <DataTable
                      columns={columns}
                      data={data}
                      pagination
                      paginationPerPage={5}
                      paginationRowsPerPageOptions={[5, 10, 20, 40]}
                    />
                  ) : (
                    <p className="text-center mt-5">Loading...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DataPasBody;
