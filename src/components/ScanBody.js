import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const imageCaptions = [
  "Arrival (A)",
  "Boarding Lounge (B)",
  "Check-In (C)",
  "Kade (F)",
  "In Kade (G)",
  "Main Power House (L)",
  "Meteorology Facility (M)",
  "Navigation and Telecommunication (N)",
  "Fuel Supply (O)",
  "Apron Area (P)",
  "Radar Hall (R)",
  "Tower (T)",
  "Baggage Make-Up Airside (U)",
  "Vital Area (V)",
  "All Area(All)",
];

const kodeArea = [
  "A",
  "B",
  "C",
  "F",
  "G",
  "L",
  "M",
  "N",
  "O",
  "P",
  "R",
  "T",
  "U",
  "V",
  "All",
];

const ScanValidationPage = ({ nama, nip, unit }) => {
  const images = [
    "/angkasapura/arrival_logo.jpeg",
    "/angkasapura/boarding-lounge_logo.jpeg",
    "/angkasapura/check-in_logo.jpeg",
    "/angkasapura/kade_logo.jpeg",
    "/angkasapura/in-kade_logo.jpeg",
    "/angkasapura/main-power-house_logo.jpeg",
    "/angkasapura/meteorology-facility_logo.jpeg",
    "/angkasapura/navigation-telecommunication_logo.jpeg",
    "/angkasapura/fuel-supply_logo.jpeg",
    "/angkasapura/apron-area_logo.jpeg",
    "/angkasapura/radar-hall_logo.jpeg",
    "/angkasapura/tower_logo.jpeg",
    "/angkasapura/baggage-makeup-airside_logo.jpeg",
    "/angkasapura/vital-area_logo.jpeg",
  ];

  if (unit === "Admin") {
    images.push("/angkasapura/scanning.jpeg");
  }

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectedKodeArea, setSelectedKodeArea] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredUserData, setFilteredUserData] = useState([]);
  const [searchError, setSearchError] = useState(false);
  const [searchTermScanner, setSearchTermScanner] = useState("");
  const [searchTermManual, setSearchTermManual] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pasStatus, setPasStatus] = useState("");
  const [pasAkses, setPasAkses] = useState("");
  const inputRefScanner = useRef(null);
  const inputRefManual = useRef(null);
  const [epc, setEpc] = useState("");

  const extractEpc = async (value) => {
    try {
      // Convert the URL to lowercase to handle case insensitivity
      const lowerCaseUrl = value.toLowerCase();

      // Ensure the URL starts with the correct prefix
      if (
        !lowerCaseUrl.startsWith(
          "https://otban3.web.id/mv5pas/verif/pas.php?id="
        )
      ) {
        throw new Error("Invalid URL format");
      }

      // Use regex to extract the ID value
      const urlPattern =
        /^https:\/\/otban3\.web\.id\/mv5pas\/verif\/pas\.php\?id=([a-zA-Z0-9]+)$/i;
      const match = lowerCaseUrl.match(urlPattern);
      if (match) {
        const idValue = match[1];
        setEpc(idValue);
      } else {
        throw new Error("Invalid URL format");
      }
    } catch (error) {
      console.error("Invalid URL");
      setEpc(""); // Clear ID if there's an error
    }
  };

  // Effect to handle changes in searchTermScanner or epc
  useEffect(() => {
    if (epc) {
      setTimeout(() => {
        fetchData(epc);
        setDeleting(true);
      }, 1000);
    } else if (searchTermScanner) {
      setTimeout(() => {
        fetchData(searchTermScanner);
        setDeleting(true);
      }, 1000);
    }
  }, [epc, searchTermScanner]);

  const determineMessage = (currentUser) => {
    // Cek apakah pas aktif atau dalam proses
    if (
      currentUser.pas_aktif === "aktif" ||
      currentUser.pas_aktif === "proses"
    ) {
      // Jika pengguna memiliki kode area V, maka harus diterima di area L, M, N, R, T
      if (currentUser.kode_area.includes("V")) {
        if (
          selectedKodeArea === 5 ||
          selectedKodeArea === 6 ||
          selectedKodeArea === 7 ||
          selectedKodeArea === 8 ||
          selectedKodeArea === 10 ||
          selectedKodeArea === 11 ||
          selectedKodeArea === 13 ||
          currentUser.kode_area.includes(kodeArea[selectedKodeArea])
        ) {
          setPasStatus("Pas Aktif");
          setPasAkses("Diterima");
          return "Diterima";
        } else if (selectedKodeArea === kodeArea.length - 1) {
          setPasStatus("Pas Aktif");
          setPasAkses("");
          return "Pas Aktif";
        } else {
          setPasStatus("Pas Aktif");
          setPasAkses("Ditolak");
          return "Ditolak";
        }
      } else {
        // Jika bukan kode area V, periksa apakah terkait dengan area yang dipilih
        if (currentUser.kode_area.includes(kodeArea[selectedKodeArea])) {
          setPasStatus("Pas Aktif");
          setPasAkses("Diterima");
          return "Diterima";
        } else if (selectedKodeArea === kodeArea.length - 1) {
          setPasStatus("Pas Aktif");
          setPasAkses("");
          return "Pas Aktif";
        } else if (
          !currentUser.kode_area.includes(kodeArea[selectedKodeArea])
        ) {
          setPasStatus("Pas Aktif");
          setPasAkses("Ditolak");
          return "Ditolak";
        }
      }
    } else {
      setPasStatus("Pas Nonaktif");
      setPasAkses("");
      return "Pas Nonaktif";
    }
  };

  const fetchData = async (searchTerm) => {
    if (searchTerm === "") {
      return;
    }

    setLoading(true);
    setSearchError(false);

    const apis = [
      process.env.REACT_APP_API_URL + `/pas/search/${searchTerm}`,
      process.env.REACT_APP_API_URL + `/pas/search/blacklist/${searchTerm}`,
      process.env.REACT_APP_API_URL + `/pas/search/stoplist/${searchTerm}`,
    ];

    const fetchFromAPI = async (url) => {
      try {
        const response = await axios.get(url);
        return response.data.length > 0 ? response.data : null;
      } catch (error) {
        return null;
      }
    };

    let filteredData = null;
    let dataFound = false;

    for (let api of apis) {
      filteredData = await fetchFromAPI(api);
      if (filteredData) {
        dataFound = true;
        break;
      }
    }

    if (dataFound) {
      setFilteredUserData(filteredData);

      const currentUser = filteredData[0];
      const message = determineMessage(currentUser);

      try {
        await axios.post(process.env.REACT_APP_API_URL + "/activitylog", {
          pendaftaran_id: currentUser.pendaftaran_id,
          pas_number: currentUser.pas_number,
          kode_area: currentUser.kode_area,
          nama_lengkap: currentUser.nama_lengkap,
          kode_area_access: kodeArea[selectedKodeArea],
          access_message: message,
          petugas_name: nama,
          petugas_nip: nip,
        });
      } catch (error) {
        console.log("Error saving data to activitylog:", error);
      }
    } else {
      setSearchError(true);
      console.error("No data found in any API");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (deleting) {
      setTimeout(() => {
        setSearchTermScanner("");
        setEpc("");
        setDeleting(false);
      }, 1000);
    }
  }, [deleting]);

  const handleClick = (index) => {
    setSearchError(false);
    setSelectedImageIndex(index);
    setSelectedKodeArea(index);
    setShowModal(true);
  };

  const handleScannerInputChange = async (event) => {
    setFilteredUserData([]);
    const value = event.target.value;

    try {
      extractEpc(value); // Wait for extractEpc to finish
    } catch (error) {
      console.error("Error extracting EPC:", error);
    }

    setSearchTermScanner(value);
  };

  const handleManualInputChange = (event) => {
    setSearchTermManual(event.target.value);
  };

  const handleManualSearch = () => {
    setFilteredUserData([]);
    fetchData(searchTermManual);
    setSearchTermManual("");
  };

  const handleCloseModal = () => {
    setFilteredUserData([]);
    setShowModal(false);
    setSelectedImageIndex(null);
    setSearchTermScanner("");
    setEpc("");
    setSearchTermManual("");
  };

  useEffect(() => {
    if (showModal) {
      // Focus input after modal is shown
      inputRefScanner.current.focus();
    }
  }, [showModal]);

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Scan Pas Bandara</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Scan Pas Bandara</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {images.map((image, index) => (
              <div
                key={index}
                className="col-xs-6 col-sm-4 col-md-3 col-lg-2 mb-3 d-flex flex-column justify-content-center align-items-center"
              >
                <img
                  src={image}
                  alt={imageCaptions[index]}
                  className="img-fluid"
                  onClick={() => handleClick(index)}
                  style={{ cursor: "pointer", width: "100px", height: "91px" }}
                />
                <figcaption className="mt-2 text-center">
                  {imageCaptions[index]}
                </figcaption>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-scrollable"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {imageCaptions[selectedImageIndex]}
              </h5>
              <button
                type="button"
                className="close"
                onClick={handleCloseModal}
              >
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search (Scanner)"
                  value={searchTermScanner}
                  ref={inputRefScanner}
                  onChange={handleScannerInputChange}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search (Manual)"
                  value={searchTermManual}
                  ref={inputRefManual}
                  onChange={handleManualInputChange}
                />
                <button
                  type="button"
                  className="btn btn-primary mt-2"
                  onClick={handleManualSearch}
                >
                  Search (Manual)
                </button>
              </div>
              {loading && <p>Loading...</p>}
              {searchError && !filteredUserData.length > 0 && (
                <p className="text-danger">No matching records found.</p>
              )}
              <div className="user-list">
                {filteredUserData.map((user) => (
                  <div className="border p-3 mb-3" key={user.pendaftaran_id}>
                    <div className="mb-4" style={{ textAlign: "center" }}>
                      <img
                        src={user.pas_photo}
                        alt={user.nama_lengkap}
                        style={{ width: "150px", height: "150px" }}
                      />
                    </div>
                    <div className="mb-4" style={{ textAlign: "center" }}>
                      {pasStatus === "Pas Aktif" ? (
                        <div
                          style={{
                            backgroundColor: "green",
                            color: "white",
                            padding: "5px 10px",
                            borderRadius: "5px",
                          }}
                        >
                          Pas Aktif
                        </div>
                      ) : (
                        <div
                          style={{
                            backgroundColor: "red",
                            color: "white",
                            padding: "5px 10px",
                            borderRadius: "5px",
                          }}
                        >
                          Pas Non-Aktif
                        </div>
                      )}
                    </div>
                    {pasStatus === "Pas Aktif" && pasAkses && (
                      <div className="mb-4" style={{ textAlign: "center" }}>
                        {pasAkses === "Diterima" ? (
                          <div
                            style={{
                              backgroundColor: "green",
                              color: "white",
                              padding: "5px 10px",
                              borderRadius: "5px",
                            }}
                          >
                            Diterima
                          </div>
                        ) : (
                          <div
                            style={{
                              backgroundColor: "red",
                              color: "white",
                              padding: "5px 10px",
                              borderRadius: "5px",
                            }}
                          >
                            Ditolak
                          </div>
                        )}
                      </div>
                    )}
                    <strong>Pendaftaran ID:</strong> {user.pendaftaran_id}
                    <br />
                    <strong>Pas Terbit:</strong> {user.pas_terbit}
                    <br />
                    <strong>Pas Aktif:</strong> {user.pas_aktif}
                    <br />
                    <strong>Pas Number:</strong> {user.pas_number}
                    <br />
                    <strong>Pas Expired Date:</strong> {user.pas_expired_date}
                    <br />
                    <strong>Kode Area:</strong> {user.kode_area}
                    <br />
                    <strong>Instansi Name:</strong> {user.instansi_name}
                    <br />
                    <strong>Nama Lengkap:</strong> {user.nama_lengkap}
                    <br />
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanValidationPage;
