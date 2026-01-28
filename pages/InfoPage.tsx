import React from 'react';
import { useParams, Link } from 'react-router-dom';

export const InfoPage: React.FC = () => {
    // We can use the URL path to determine content, or pass props if used as distinct components
    const path = window.location.hash.replace('#/', '');

    let title = "Halaman Informasi";
    let content: React.ReactNode = "Konten sedang disiapkan.";

    switch (path) {
        case 'about':
            title = "Tentang Kami";
            content = (
                <div className="space-y-6">
                    <p>
                        Selamat datang di <strong>Avalon Games Ecosystem</strong>, platform distribusi konten digital dan top-up game terdepan yang dirancang untuk memenuhi kebutuhan gamer modern. Didirikan pada tahun 2023, kami beroperasi dengan visi tunggal: menghadirkan akses instan, aman, dan terjangkau ke mata uang premium dalam game bagi komunitas global.
                    </p>
                    <p>
                        Kami bukan sekadar marketplace; kami adalah ekosistem yang terintegrasi langsung dengan penyedia layanan game server-side resmi. Setiap transaksi yang diproses melalui node kami dienkripsi dengan protokol keamanan tingkat militer (AES-256), menjamin bahwa aset digital Anda mendarat di akun tujuan tanpa hambatan, dalam hitungan detik.
                    </p>
                    <p>
                        Didukung oleh infrastruktur teknologi RIZKIADP Core, kami memproses ribuan transaksi setiap hari dengan tingkat keberhasilan 99.9%. Kami percaya bahwa pengalaman gaming Anda tidak boleh terganggu oleh proses pembayaran yang berbelit. Di Avalon, kecepatan adalah standar, dan kepuasan pelanggan adalah parameter keberhasilan kami.
                    </p>
                </div>
            );
            break;
        case 'help':
            title = "Pusat Bantuan";
            content = (
                <div className="space-y-6">
                    <p>Kanal dukungan pelanggan kami beroperasi 24/7 untuk memastikan kesinambungan layanan bagi seluruh pengguna.</p>

                    <h3 className="text-xl font-bold text-primary mt-6">Sering Ditanyakan (FAQ)</h3>
                    <ul className="list-disc pl-5 space-y-2 marker:text-primary text-slate-300">
                        <li>
                            <strong>Berapa lama proses top-up berlangsung?</strong><br />
                            Mayoritas transaksi diproses secara instan (1-3 detik) setelah pembayaran terverifikasi oleh gateway partner kami.
                        </li>
                        <li>
                            <strong>Metode pembayaran apa yang tersedia?</strong><br />
                            Kami mendukung QRIS (Instant), Virtual Account Bank Nasional (BCA, Mandiri, BRI, BNI), dan E-Wallet utama.
                        </li>
                        <li>
                            <strong>Transaksi saya gagal, apa yang harus dilakukan?</strong><br />
                            Jika saldo terpotong namun item belum masuk dalam 5 menit, silakan hubungi tim CS kami dengan menyertakan Transaction ID. Sistem kami memiliki fitur <em>auto-reconcile</em> yang akan mengembalikan dana secara otomatis jika terjadi kegagalan di sisi provider.
                        </li>
                    </ul>

                    <p className="mt-4">
                        Untuk eskalasi masalah teknis, hubungi kami melalui:<br />
                        Email: <span className="text-primary font-mono">support@avalon-games.com</span><br />
                        WhatsApp: <span className="text-primary font-mono">+62-8XX-XXXX-XXXX (Business Hours)</span>
                    </p>
                </div>
            );
            break;
        case 'terms':
            title = "Ketentuan Layanan";
            content = (
                <div className="space-y-4 text-justify">
                    <p>
                        Pengguna yang mengakses dan menggunakan layanan Avalon Games Ecosystem dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan berikut ini. Perjanjian ini merupakan kontrak legal yang mengikat antara Anda (Pengguna) dan Avalon Games (Penyedia Layanan).
                    </p>
                    <h3 className="text-lg font-bold text-primary">1. Definisi Layanan</h3>
                    <p>
                        Avalon Games bertindak sebagai perantara resmi antara pengguna dan pengembang game/penerbit. Kami tidak memproduksi konten game itu sendiri, melainkan memfasilitasi pembelian lisensi penggunaan aset virtual (diamonds, coins, credits).
                    </p>
                    <h3 className="text-lg font-bold text-primary">2. Kewajiban Pengguna</h3>
                    <p>
                        Pengguna wajib memasukkan data akun game (User ID / Zone ID) dengan benar. Kesalahan input yang mengakibatkan aset terkirim ke akun yang salah sepenuhnya menjadi tanggung jawab pengguna dan tidak dapat direvisi atau di-refund (Non-Refundable).
                    </p>
                    <h3 className="text-lg font-bold text-primary">3. Kebijakan Pengembalian Dana (Refund)</h3>
                    <p>
                        Refund hanya akan diproses jika: (a) Produk tidak diterima dalam waktu 1x24 jam karena kesalahan sistem kami; atau (b) Produk out of stock setelah pembayaran berhasil. Dana akan dikembalikan ke saldo akun Avalon atau rekening sumber sesuai kebijakan admin.
                    </p>
                    <h3 className="text-lg font-bold text-primary">4. Aktivitas Ilegal</h3>
                    <p>
                        Segala bentuk percobaan peretasan, manipulasi sistem, atau penggunaan kartu kredit curian (carding) akan ditindak tegas secara hukum dan akun terkait akan di-banned permanen (Blacklisted).
                    </p>
                </div>
            );
            break;
        case 'privacy':
            title = "Kebijakan Privasi";
            content = (
                <div className="space-y-4 text-justify">
                    <p>
                        Di Avalon Games Ecosystem, privasi data Anda adalah prioritas absolut. Dokumen ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda sesuai dengan standar perlindungan data internasional (GDPR compliance).
                    </p>
                    <h3 className="text-lg font-bold text-primary">1. Pengumpulan Data</h3>
                    <p>
                        Kami hanya mengumpulkan data esensial yang diperlukan untuk pemrosesan transaksi: Username, Email (untuk bukti pembayaran), dan User ID Game. Kami TIDAK PERNAH menyimpan informasi kartu kredit atau kredensial perbankan Anda di server kami.
                    </p>
                    <h3 className="text-lg font-bold text-primary">2. Penggunaan Data</h3>
                    <p>
                        Data digunakan semata-mata untuk: (a) Memverifikasi kepemilikan akun; (b) Mengirimkan notifikasi status pesanan; dan (c) Mencegah aktivitas penipuan. Kami tidak akan pernah menjual data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran.
                    </p>
                    <h3 className="text-lg font-bold text-primary">3. Keamanan Data</h3>
                    <p>
                        Seluruh komunikasi data dienkripsi menggunakan SSL/TLS 256-bit. Database kami dilindungi oleh firewall berlapis dan akses terbatas (RBAC - Role Based Access Control).
                    </p>
                    <p className="border-t border-white/10 pt-4 mt-8 text-sm text-slate-400">
                        Terakhir diperbarui: 24 Januari 2026. Kami berhak mengubah kebijakan ini sewaktu-waktu tanpa pemberitahuan sebelumnya.
                    </p>
                </div>
            );
            break;
        default:
            title = "Info";
    }

    return (
        <div className="min-h-screen pt-32 px-6 max-w-4xl mx-auto">
            <div className="glass-panel p-10 rounded-3xl border border-white/10">
                <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Kembali
                </Link>
                <h1 className="text-4xl font-bold mb-6 text-main uppercase">{title}</h1>
                <div className="text-slate-300 leading-relaxed text-lg">
                    {content}
                </div>
            </div>
        </div>
    );
};
