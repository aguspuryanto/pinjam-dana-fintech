import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CreditCard, FileText, UserCheck, AlertCircle } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali, Pengguna!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KYC Status Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Status Verifikasi
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Belum Terverifikasi</div>
            <p className="text-xs text-muted-foreground mt-2">
              Lengkapi data KYC untuk mengajukan pinjaman
            </p>
            <Button size="sm" className="mt-4 w-full" asChild>
              <Link to="/kyc">Verifikasi Sekarang</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Loan Limit Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Limit Pinjaman
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 500.000</div>
            <p className="text-xs text-muted-foreground mt-2">
              Maksimum pinjaman yang tersedia
            </p>
            <Button size="sm" variant="outline" className="mt-4 w-full" asChild>
              <Link to="/loan/apply">Ajukan Pinjaman</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Active Loan Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pinjaman Aktif
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground mt-2">
              Tidak ada pinjaman aktif
            </p>
          </CardContent>
        </Card>

        {/* Payment Due Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jatuh Tempo</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground mt-2">
              Tidak ada tagihan jatuh tempo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button variant="outline" className="h-24" asChild>
          <Link to="/loan/apply" className="flex flex-col items-center justify-center gap-2">
            <CreditCard className="h-6 w-6" />
            <span>Ajukan Pinjaman</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-24" asChild>
          <Link to="/payment" className="flex flex-col items-center justify-center gap-2">
            <CreditCard className="h-6 w-6" />
            <span>Bayar Tagihan</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-24" asChild>
          <Link to="/bank" className="flex flex-col items-center justify-center gap-2">
            <CreditCard className="h-6 w-6" />
            <span>Kelola Rekening</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-24" asChild>
          <Link to="/kyc" className="flex flex-col items-center justify-center gap-2">
            <UserCheck className="h-6 w-6" />
            <span>Verifikasi KYC</span>
          </Link>
        </Button>
      </div> */}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Belum ada aktivitas</p>
                <p className="text-sm text-muted-foreground">
                  Riwayat transaksi akan muncul di sini
                </p>
              </div>
              <div className="text-sm text-muted-foreground">-</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}