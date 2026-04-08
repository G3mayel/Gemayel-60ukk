import React, { useState, useEffect, useRef } from "react";
import Lenis from 'lenis'
import { Head } from "@inertiajs/react";
import { SiInstagram,SiFacebook, SiX, SiLinkerd } from "@icons-pack/react-simple-icons";

const background = "/img/background.svg";
const background2 = "/img/background2.svg";
const background3 = "/img/background3.svg";
const background4 = "/img/background4.svg";
const background5 = "/img/background5.svg";
const background6 = "/img/background6.svg";
const background7 = "/img/background7.svg";
const background8 = "/img/background8.svg";
const chair = "/img/chair.svg";
const table = "/img/table.svg";
const lineSarprasku = "/img/line.svg";
const line2 = "/img/line2.svg";
const iconChat = "/img/chat.svg";
const iconSearch = "/img/search.svg";
const iconTools = "/img/tools.svg";
const iconMegaphone = "/img/megaphone.svg";
const guru = "/img/guru.svg";
const siswa = "/img/siswa.svg";
const tabAdmin = "/img/tabadmin.svg";
const tabSiswa = "/img/tabsiswa.svg";

const kotor1 = "/img/kotor1.svg";
const kotor2 = "/img/kotor2.svg";
const kotor3 = "/img/kotor3.svg";
const kotor4 = "/img/kotor4.svg";
const kotor5 = "/img/kotor5.svg";
const kotor6 = "/img/kotor6.svg";

const review1 = "/img/review1.svg";
const review2 = "/img/review2.svg";
const review3 = "/img/review3.svg";
const review4 = "/img/review4.svg";
const review5 = "/img/review5.svg";
const review6 = "/img/review6.svg";
const review7 = "/img/review7.svg";
const review8 = "/img/review8.svg";

const PlusIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const MinusIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const lenis = new Lenis({
  autoRaf: true,
});


const Landingpage = () => {
    const [scrollY, setScrollY] = useState(0);
    const [box2ScrollOffset, setBox2ScrollOffset] = useState(0);
    const [box3ScrollOffset, setBox3ScrollOffset] = useState(0);
    const [tabLeftTranslate, setTabLeftTranslate] = useState(0);
    const [tabRightTranslate, setTabRightTranslate] = useState(0);
    const [openFaq, setOpenFaq] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

    const box2Ref = useRef(null);
    const box3Ref = useRef(null);
    const box5Ref = useRef(null);
    const box6Ref = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollY(currentScrollY);
            setIsScrolled(currentScrollY > 50);

            const viewportHeight = window.innerHeight;

            if (box2Ref.current) {
                const rect2 = box2Ref.current.getBoundingClientRect();
                const distanceScrolled2 = viewportHeight - rect2.top;
                setBox2ScrollOffset(Math.max(0, distanceScrolled2));
            }

            if (box3Ref.current) {
                const rect3 = box3Ref.current.getBoundingClientRect();
                const distanceScrolled3 = viewportHeight - rect3.top;
                setBox3ScrollOffset(Math.max(0, distanceScrolled3));
            }

            if (box5Ref.current) {
                const rect5 = box5Ref.current.getBoundingClientRect();
                const distanceScrolled5 = viewportHeight - rect5.top;
                const translateAmount5 = Math.min(
                    distanceScrolled5 * 0.015,
                    40,
                );
                setTabLeftTranslate(Math.max(0, translateAmount5));
            }

            if (box6Ref.current) {
                const rect6 = box6Ref.current.getBoundingClientRect();
                const distanceScrolled6 = viewportHeight - rect6.top;
                const translateAmount6 = Math.min(
                    distanceScrolled6 * 0.015,
                    40,
                );
                setTabRightTranslate(Math.max(0, translateAmount6));
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const moveFactor = Math.min(scrollY * 0.05, 40);
    const moveAmountBox2 = Math.min(box2ScrollOffset * 0.03, 35);
    const rotateBox3 = Math.min(box3ScrollOffset * 0.02, 15);

    const reviewsRow1 = [review1, review2, review3, review4];
    const reviewsRow2 = [review5, review6, review7, review8];

    const faqs = [
        {
            question: "Apa itu SarprasKu?",
            answer: "Sarprasku adalah platform pelaporan digital yang memudahkan warga sekolah (siswa, guru, dan staf) untuk melaporkan kerusakan fasilitas sekolah agar lebih cepat ditindaklanjuti.",
        },
        {
            question: "Siapa saja yang bisa membuat laporan di SarprasKu?",
            answer: "Semua warga sekolah, termasuk siswa, guru, dan staf administrasi yang memiliki akun atau akses ke platform SarprasKu dapat membuat laporan kerusakan fasilitas.",
        },
        {
            question: "Bagaimana cara melaporkan fasilitas yang rusak?",
            answer: "Kamu cukup login ke aplikasi, pilih menu 'Buat Laporan', unggah foto kerusakan yang jelas, isi deskripsi singkat, pilih lokasi atau kategori fasilitas, lalu tekan tombol 'Kirim'.",
        },
        {
            question:
                "Apakah saya bisa tahu laporan saya sudah diperbaiki atau belum?",
            answer: "Tentu! Kamu bisa memantau status setiap laporanmu di menu 'Riwayat Laporan'. Status akan diperbarui secara berkala mulai dari 'Menunggu', 'Diproses', hingga 'Selesai'.",
        },
        {
            question:
                "Berapa lama waktu yang dibutuhkan sampai fasilitas diperbaiki?",
            answer: "Waktu perbaikan sangat bervariasi tergantung pada tingkat kerusakan dan ketersediaan teknisi sekolah. Namun, admin akan selalu berusaha menindaklanjuti setiap laporan secepat mungkin.",
        },
        {
            question:
                "Bagaimana jika saya salah melaporkan atau ingin membatalkan laporan?",
            answer: "Jika laporanmu masih berstatus 'Menunggu', kamu dapat membatalkan atau mengeditnya melalui menu detail laporan. Jika statusnya sudah 'Diproses', silakan hubungi admin sekolah secara langsung.",
        },
    ];

    return (
        <div className="min-h-screen w-full bg-slate-100 flex flex-col gap-4 p-2 md:p-4 box-border overflow-x-hidden relative">
            <style>
                {`
         @font-face {
          font-family: 'Inter';
          src: url('/font/Inter.ttf');
         }

         @font-face {
          font-family: 'BaksoSapi';
          src: url('/font/BaksoSapi.otf');
         }
         .font-bakso-sapi {
          font-family: 'BaksoSapi', sans-serif;
         }

         @keyframes marquee {
           0% { transform: translateX(0%); }
           100% { transform: translateX(-50%); }
         }

         .animate-marquee {
           animation: marquee 40s linear infinite;
         }

         .animate-marquee-slow {
           animation: marquee 50s linear infinite;
         }

                 html {
  scroll-behavior: smooth;
}
        `}
            </style>
            <Head title="SarprasKu - Platform Pelaporan Fasilitas Sekolah" >
                <link rel="icon" type="image/svg+xml" href="/img/logo-s-siswa.svg" />
            </Head>

            <nav
                className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[98%] md:w-[98%] lg:w-[96%] max-w-[1600px] px-8 py-3 rounded-3xl flex items-center justify-between transition-all duration-300 border ${
                    isScrolled
                        ? "bg-white/80 backdrop-blur-md shadow-lg border-white/50"
                        : "bg-white/50 backdrop-blur-sm shadow-sm border-transparent"
                }`}
            >
                <div className="flex items-center gap-2">
                    <a href="#" className="font-extrabold text-xl md:text-2xl text-[#0037ff] tracking-tighter hover:opacity-80 transition-opacity cursor-pointer">
                        SarprasKu
                    </a>
                </div>

                <div className="hidden md:flex items-center gap-20 font-semibold text-sm tracking-wider text-black/70">
                    <a
                        href="#tentang"
                        className="hover:text-[#0037ff] transition-all hover:scale-105"
                    >
                        Tentang
                    </a>
                    <a
                        href="#fitur"
                        className="hover:text-[#0037ff] transition-all hover:scale-105"
                    >
                        Fitur
                    </a>
                    <a
                        href="#keunggulan"
                        className="hover:text-[#0037ff] transition-all hover:scale-105"
                    >
                        Keunggulan
                    </a>
                    <a
                        href="#faq"
                        className="hover:text-[#0037ff] transition-all hover:scale-105"
                    >
                        FAQ
                    </a>
                </div>

                <div className="flex items-center gap-8">
                    <a
                        href="/login"
                        className="bg-[#0037ff] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 text-sm md:text-base inline-block"
                    >
                        Login
                    </a>
                </div>
            </nav>
            <div
                className="relative w-full min-h-[calc(100vh-1rem)] md:min-h-[calc(100vh-2rem)] rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden bg-cover bg-center border border-slate-200 p-8 md:p-12 flex flex-col justify-center items-center text-center shrink-0 mt-16 md:mt-0"
                style={{ backgroundImage: `url(${background})` }}
            >
                <div className="flex flex-col justify-center items-center gap-6 md:gap-10 z-20 relative w-full">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl text-[#0037ff] font-extrabold leading-[1.1]">
                        Ada fasilitas sekolah yang rusak?
                    </h1>

                    <p className="font-bakso-sapi text-xl md:text-3xl lg:text-4xl text-black max-w-md md:max-w-3xl mx-auto leading-relaxed">
                        Laporin aja di{" "}
                        <span className="relative font-bold text-[#0037ff] whitespace-nowrap">
                            SARPRASKU
                            <img
                                src={lineSarprasku}
                                alt=""
                                className="absolute w-full h-auto -bottom-2 md:-bottom-3 left-0 pointer-events-none"
                                draggable={false}
                            />
                        </span>
                        . Nanti kamu bisa pantau progresnya sampai beres
                    </p>
                </div>

                <img
                    src={table}
                    alt="Meja"
                    className="absolute w-[35%] md:w-[30%] lg:w-[25%] max-w-[400px] -left-4 -bottom-4 md:-left-5 md:-bottom-10 z-30 drop-shadow-xl transition-transform duration-75 ease-linear"
                    style={{
                        transform: `translate(-${moveFactor}px, ${moveFactor}px) rotate(-18deg)`,
                    }}
                    draggable={false}
                />

                <img
                    src={chair}
                    alt="Kursi"
                    className="absolute w-[35%] md:w-[30%] lg:w-[25%] max-w-[320px] -right-4 -bottom-6 md:-right-10 md:-bottom-12 z-30 drop-shadow-xl transition-transform duration-75 ease-linear"
                    style={{
                        transform: `translate(${moveFactor}px, ${moveFactor}px) rotate(22deg)`,
                    }}
                    draggable={false}
                />
            </div>

            <div
                id="tentang"
                ref={box2Ref}
                className="relative w-full min-h-[calc(100vh-1rem)] md:min-h-[calc(100vh-2rem)] rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden bg-cover bg-center border border-slate-200 p-8 md:p-12 flex flex-col justify-center items-center text-center shrink-0"
                style={{ backgroundImage: `url(${background2})` }}
            >
                <div className="z-20 relative w-full max-w-2xl px-6 md:px-12 flex flex-col gap-6 md:gap-8">
                    <h2 className="text-base md:text-xl font-bold text-black leading-relaxed tracking-[-4%]">
                        APA ITU SARPRASKU?
                    </h2>
                    <p className="text-xl md:text-2xl font-normal text-black/80 leading-relaxed tracking-[-4%]">
                        Kerusakan fasilitas sekolah sering terlihat sepele, tapi
                        bisa jadi masalah jika tidak cepat ditangani.
                    </p>
                    <p className="text-xl md:text-2xl font-normal text-black/80 leading-relaxed tracking-[-4%]">
                        Sayangnya, proses pelaporannya sering tidak jelas:
                        bingung ke siapa, menumpuk di chat, lalu hilang tanpa
                        status.
                    </p>
                    <p className="text-xl md:text-2xl font-normal text-black/80 leading-relaxed tracking-[-4%]">
                        <span className="text-[#0037ff] font-bold">
                            SarprasKu
                        </span>{" "}
                        adalah platform untuk melaporkan kerusakan fasilitas
                        sekolah secara rapi dan transparan. Kamu cukup foto, isi
                        laporan singkat, pilih kategori, lalu kirim, kemudian
                        pantau statusnya hingga selesai.
                    </p>
                </div>

                <img
                    src={kotor1}
                    alt=""
                    className="absolute -top-4 -left-4 w-[25%] md:w-[15%] max-w-[180px] aspect-square border-[6px] border-white rounded-2xl shadow-xl z-10 object-cover transition-transform duration-75 ease-linear"
                    style={{
                        transform: `translate(-${moveAmountBox2}px, -${moveAmountBox2}px) rotate(12deg)`,
                    }}
                    draggable={false}
                />
                <img
                    src={kotor2}
                    alt=""
                    className="absolute top-[30%] -left-6 md:left-4 w-[28%] md:w-[18%] max-w-[200px] aspect-square border-[6px] border-white rounded-2xl shadow-xl z-10 object-cover transition-transform duration-75 ease-linear"
                    style={{
                        transform: `translate(-${moveAmountBox2}px, 0px) rotate(-6deg)`,
                    }}
                    draggable={false}
                />
                <img
                    src={kotor3}
                    alt=""
                    className="absolute bottom-4 left-4 md:bottom-12 md:left-12 w-[30%] md:w-[20%] max-w-[220px] aspect-square border-[6px] border-white rounded-2xl shadow-xl z-10 object-cover transition-transform duration-75 ease-linear"
                    style={{
                        transform: `translate(-${moveAmountBox2}px, ${moveAmountBox2}px) rotate(-12deg)`,
                    }}
                    draggable={false}
                />
                <img
                    src={kotor4}
                    alt=""
                    className="absolute -top-6 -right-6 w-[30%] md:w-[20%] max-w-[220px] aspect-square border-[6px] border-white rounded-2xl shadow-xl z-10 object-cover transition-transform duration-75 ease-linear"
                    style={{
                        transform: `translate(${moveAmountBox2}px, -${moveAmountBox2}px) rotate(-15deg)`,
                    }}
                    draggable={false}
                />
                <img
                    src={kotor5}
                    alt=""
                    className="absolute top-[45%] -right-4 w-[20%] md:w-[14%] max-w-[160px] aspect-square border-[6px] border-white rounded-2xl shadow-xl z-10 object-cover transition-transform duration-75 ease-linear"
                    style={{
                        transform: `translate(${moveAmountBox2}px, 0px) rotate(4deg)`,
                    }}
                    draggable={false}
                />
                <img
                    src={kotor6}
                    alt=""
                    className="absolute bottom-6 right-2 md:bottom-16 md:right-16 w-[22%] md:w-[14%] max-w-[180px] aspect-square border-[6px] border-white rounded-2xl shadow-xl z-10 object-cover transition-transform duration-75 ease-linear"
                    style={{
                        transform: `translate(${moveAmountBox2}px, ${moveAmountBox2}px) rotate(10deg)`,
                    }}
                    draggable={false}
                />
            </div>

            <div
                id="fitur"
                ref={box3Ref}
                className="relative w-full min-h-[calc(100vh-1rem)] md:min-h-[calc(100vh-2rem)] rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden bg-cover bg-center border border-slate-200 p-8 md:p-12 flex flex-col justify-center items-center text-center shrink-0"
                style={{ backgroundImage: `url(${background3})` }}
            >
                <div className="z-20 relative w-full max-w-4xl px-4 md:px-12 flex flex-col gap-6 md:gap-8">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0037ff] leading-[1.2] tracking-tight">
                        Goodbye fasilitas rusak, Sarprasku bantu kamu lapor
                        sampai beres.
                    </h2>
                    <p className="text-xl md:text-2xl font-normal text-black/90 leading-relaxed tracking-tight max-w-3xl mx-auto">
                        <span className="text-[#0037ff] font-bold">
                            SarprasKu
                        </span>{" "}
                        bikin pelaporan sarpras jadi lebih cepat, rapi, dan
                        jelas. Cukup foto kerusakan, isi laporan singkat, pilih
                        kategori, lalu kirim. Setelah itu, kamu bisa pantau
                        status laporan dari menunggu, diproses, sampai selesai,
                        jadi tidak ada laporan yang hilang di chat atau
                        terlupakan. Dengan alur yang transparan ini, koordinasi
                        jadi lebih mudah dan fasilitas sekolah bisa segera
                        ditangani.
                    </p>
                </div>

                <img
                    src={iconChat}
                    alt="Chat"
                    className="absolute -top-6 -left-6 w-[35%] md:w-[20%] max-w-[200px] drop-shadow-2xl z-10 transition-transform duration-75 ease-linear"
                    style={{ transform: `rotate(${15 + rotateBox3}deg)` }}
                    draggable={false}
                />
                <img
                    src={iconSearch}
                    alt="Search"
                    className="absolute -top-6 -right-6 w-[35%] md:w-[20%] max-w-[200px] drop-shadow-2xl z-10 transition-transform duration-75 ease-linear"
                    style={{ transform: `rotate(${190 - rotateBox3}deg)` }}
                    draggable={false}
                />
                <img
                    src={iconTools}
                    alt="Tools"
                    className="absolute -bottom-6 -left-6 w-[35%] md:w-[20%] max-w-[200px] drop-shadow-2xl z-10 transition-transform duration-75 ease-linear"
                    style={{ transform: `rotate(${17 + rotateBox3}deg)` }}
                    draggable={false}
                />
                <img
                    src={iconMegaphone}
                    alt="Megaphone"
                    className="absolute -bottom-4 -right-4  w-[35%] md:w-[20%] max-w-[200px] drop-shadow-2xl z-10 transition-transform duration-75 ease-linear"
                    style={{ transform: `rotate(${25 - rotateBox3}deg)` }}
                    draggable={false}
                />
            </div>

            <div
                id="keunggulan"
                className="relative w-full min-h-[40vh] md:min-h-[500px] py-16 md:py-24 rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden bg-cover bg-center border border-slate-200 px-8 flex flex-col justify-center items-center text-center shrink-0"
                style={{ backgroundImage: `url(${background4})` }}
            >
                <div className="z-20 relative w-full max-w-2xl px-2 md:px-12 flex flex-col gap-6 md:gap-8">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0037ff] leading-[1.2] tracking-tight">
                        Dibuat untuk <br />
                        <span className="relative inline-block whitespace-nowrap">
                            <span className="relative">
                                semua
                                <img
                                    src={line2}
                                    alt=""
                                    className="absolute w-full h-auto -bottom-2 left-0 pointer-events-none"
                                    draggable={false}
                                />
                            </span>{" "}
                            kalangan
                        </span>
                    </h2>
                    <p className="text-xl md:text-2xl font-normal text-black/90 leading-relaxed tracking-tight">
                        <span className="text-[#0037ff] font-bold">
                            SarprasKu
                        </span>{" "}
                        memiliki UI yang dirancang secara khusus untuk
                        memastikan kemudahan operasional bagi para guru
                        sekaligus menghadirkan tampilan visual yang modern bagi
                        siswa.
                    </p>
                </div>

                <img
                    src={guru}
                    alt="Guru"
                    className="absolute bottom-0 -left-4 md:left-6 w-[40%] md:w-[28%] max-w-[400px] z-10 drop-shadow-lg"
                    draggable={false}
                />
                <img
                    src={siswa}
                    alt="Siswa"
                    className="absolute bottom-0 -right-4 md:right-9 w-[40%] md:w-[28%] max-w-[400px] z-10 drop-shadow-lg"
                    draggable={false}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div
                    ref={box5Ref}
                    className="relative w-full min-h-[60vh] md:min-h-[700px] rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden bg-cover bg-center border border-slate-200 pt-8 md:pt-12 flex flex-col items-start justify-start text-left shrink-0"
                    style={{ backgroundImage: `url(${background5})` }}
                >
                    <div
                        className="absolute inset-0 z-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(circle at bottom, rgba(0, 55, 255, 0.4) 0%, rgba(241, 245, 249, 0) 70%)`,
                        }}
                    />
                    <div className="z-10 mt-4 md:mt-8 mb-8 w-full px-8 md:px-12">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">
                            <span className="text-black block mb-2">
                                Tampilan
                            </span>
                            <span className="text-[#0037ff] block">
                                Dashboard Admin
                            </span>
                        </h2>
                    </div>
                    <div className="w-full flex-grow relative flex justify-start items-end z-10">
                        <img
                            src={tabAdmin}
                            alt="Dashboard Admin"
                            className="w-[135%] md:w-[145%] max-w-none transition-transform duration-100 ease-out object-cover object-left-bottom mr-4"
                            style={{
                                transform: `translateY(-${tabLeftTranslate}px)`,
                            }}
                            draggable={false}
                        />
                    </div>
                </div>

                <div
                    ref={box6Ref}
                    className="relative w-full min-h-[60vh] md:min-h-[700px] rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden bg-cover bg-center border border-slate-200 pt-8 md:pt-12 flex flex-col items-end justify-start text-right shrink-0"
                    style={{ backgroundImage: `url(${background6})` }}
                >
                    <div
                        className="absolute inset-0 z-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(circle at bottom, rgba(0, 55, 255, 0.4) 0%, rgba(241, 245, 249, 0) 70%)`,
                        }}
                    />
                    <div className="z-10 mt-4 md:mt-8 mb-8 w-full px-8 md:px-12">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">
                            <span className="text-black block mb-2">
                                Tampilan
                            </span>
                            <span className="text-[#0037ff] block">
                                Dashboard Siswa
                            </span>
                        </h2>
                    </div>
                    <div className="w-full flex-grow relative flex justify-end items-end z-10">
                        <img
                            src={tabSiswa}
                            alt="Dashboard Siswa"
                            className="w-[135%] md:w-[145%] max-w-none transition-transform duration-100 ease-out object-cover object-right-bottom ml-4"
                            style={{
                                transform: `translateY(-${tabRightTranslate}px)`,
                            }}
                            draggable={false}
                        />
                    </div>
                </div>
            </div>

            <div
                className="relative w-full min-h-[60vh] md:min-h-[700px] py-16 md:py-24 rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden bg-cover bg-center border border-slate-200 flex flex-col justify-center shrink-0 bg-white"
                style={{ backgroundImage: `url(${background7})` }}
            >
                <div className="z-20 w-full flex justify-center mb-12 md:mb-20 px-4">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0037ff] leading-[1.2] tracking-tight text-center">
                        Pengalaman mereka <br className="hidden md:block" />{" "}
                        menggunakan Sarprasku
                    </h2>
                </div>

                <div className="relative w-full flex flex-col gap-6 md:gap-8 overflow-hidden z-10 py-4">
                    <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
                    <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>

                    <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
                        {[...reviewsRow1, ...reviewsRow1].map((src, index) => (
                            <img
                                key={`row1-${index}`}
                                src={src}
                                alt={`Review ${index + 1}`}
                                className="w-[300px] md:w-[400px] h-auto object-contain mx-3 md:mx-4 drop-shadow-md cursor-pointer"
                                draggable={false}
                            />
                        ))}
                    </div>

                    <div className="flex w-max animate-marquee-slow hover:[animation-play-state:paused] ml-12 md:ml-24">
                        {[...reviewsRow2, ...reviewsRow2].map((src, index) => (
                            <img
                                key={`row2-${index}`}
                                src={src}
                                alt={`Review ${index + 1}`}
                                className="w-[300px] md:w-[400px] h-auto object-contain mx-3 md:mx-4 drop-shadow-md cursor-pointer"
                                draggable={false}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div
                className="relative w-full min-h-[calc(100vh-1rem)] md:min-h-[calc(100vh-2rem)] py-16 md:py-24 rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden bg-cover bg-center border border-slate-200 px-4 md:px-8 flex flex-col items-center shrink-0"
                id="faq"
                style={{ backgroundImage: `url(${background8})` }}
            >
                <div className="z-20 w-full flex justify-center mb-10 md:mb-16">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0037ff] leading-[1.2] tracking-tight text-center">
                        Frequently asked questions
                    </h2>
                </div>

                <div className="z-20 w-full max-w-5xl flex flex-col gap-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="w-full bg-white transition-colors duration-300 ease-in-out shadow-sm border border-slate-200 cursor-pointer overflow-hidden rounded-3xl hover:bg-slate-50"
                            onClick={() =>
                                setOpenFaq(openFaq === index ? null : index)
                            }
                        >
                            <div className="p-5 md:px-8 md:py-6 flex flex-col w-full">
                                <div className="flex justify-between items-center w-full gap-4">
                                    <h3 className="font-bold text-lg md:text-xl text-black leading-tight m-0">
                                        {faq.question}
                                    </h3>
                                    <div
                                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-300 flex items-center justify-center shrink-0 text-gray-800 bg-white transition-transform duration-300 ${openFaq === index ? "rotate-180" : "rotate-0"}`}
                                    >
                                        {openFaq === index ? (
                                            <MinusIcon />
                                        ) : (
                                            <PlusIcon />
                                        )}
                                    </div>
                                </div>

                                <div
                                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                                        openFaq === index
                                            ? "grid-rows-[1fr] opacity-100"
                                            : "grid-rows-[0fr] opacity-0"
                                    }`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="text-black/80 font-['Inter'] font-normal text-base md:text-lg leading-relaxed pr-8 md:pr-16 pt-4 m-0 pb-1">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full bg-[#0037ff] rounded-3xl md:rounded-[2.5rem] p-8 md:p-12 text-white flex flex-col gap-10 shrink-0 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-4">
                    <div className="md:col-span-5 flex flex-col gap-6">
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            SarprasKu
                        </h2>
                        <p className="text-white/90 font-['Inter'] text-base md:text-lg max-w-sm leading-relaxed">
                            Platform digital untuk mengelola seluruh
                            aspirasi sarana prasana sekolah dengan mudah, efisien, dan
                            transparan.
                        </p>
                        <div className="flex gap-4 mt-2">
                            <a href="#" className="cursor-pointer hover:text-white/80 transition-colors text-2xl"><SiInstagram/></a>
                            <a href="#" className="cursor-pointer hover:text-white/80 transition-colors text-2xl"><SiFacebook/></a>
                            <a href="#" className="cursor-pointer hover:text-white/80 transition-colors text-2xl"><SiLinkerd /></a>
                            <a href="#" className="cursor-pointer hover:text-white/80 transition-colors text-2xl"><SiFacebook /></a>
                        </div>
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-4 md:gap-6">
                        <h3 className="font-bold text-lg md:text-xl">Produk</h3>
                        <ul className="flex flex-col gap-4 text-white/90 font-['Inter']">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    Fitur
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    Harga
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    Demo
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    Testimonial
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-4 md:gap-6">
                        <h3 className="font-bold text-lg md:text-xl">
                            Perusahaan
                        </h3>
                        <ul className="flex flex-col gap-4 text-white/90 font-['Inter']">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    Tentang Kami
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    Karir
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    Kontak
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-3 flex flex-col gap-4 md:gap-6">
                        <h3 className="font-bold text-lg md:text-xl">
                            Dukungan
                        </h3>
                        <ul className="flex flex-col gap-4 text-white/90 font-['Inter']">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    Bantuan
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    Dokumentasi
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    Status
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="w-full h-px bg-white/20 mt-4 md:mt-8"></div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-white/90 font-['Inter'] text-sm md:text-base">
                    <p>© 2026 Sarprasku. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                        <a
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            Kebijakan Privasi
                        </a>
                        <a
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            Ketentuan & Persyaratan
                        </a>
                        <a
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            Kebijakan Cookie
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landingpage;
