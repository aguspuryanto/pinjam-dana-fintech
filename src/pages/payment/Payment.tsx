import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Banknote, Clock, FileText, Upload, ArrowRight, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PaymentMethod = "bank_transfer" | "virtual_account" | "qris" | "credit_card";

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank_transfer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Sample active loan (can be fetched from API)
  const activeLoan = {
    id: "L-123456",
    amount: 5000000,
    remaining: 3500000,
    nextPayment: {
      amount: 500000,
      dueDate: "2025-12-05",
      status: "pending" as "pending" | "paid" | "overdue",
    },
    installments: [
      { number: 1, amount: 500000, dueDate: "2025-10-05", status: "paid" },
      { number: 2, amount: 500000, dueDate: "2025-11-05", status: "paid" },
      { number: 3, amount: 500000, dueDate: "2025-12-05", status: "pending" },
      { number: 4, amount: 500000, dueDate: "2026-01-05", status: "pending" },
      { number: 5, amount: 500000, dueDate: "2026-02-05", status: "pending" },
      { number: 6, amount: 500000, dueDate: "2026-03-05", status: "pending" },
    ],
  };

  const [formData, setFormData] = useState({
    paymentAmount: activeLoan.nextPayment.amount,
    paymentProof: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, paymentProof: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (err) {
      setError("Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <CardTitle>Pembayaran Berhasil Dikirim</CardTitle>
            <CardDescription>
              Terima kasih telah melakukan pembayaran. Pembayaran Anda sedang diproses.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Nomor Transaksi</p>
              <p className="text-lg font-mono font-bold">TXN-{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
            <Button asChild className="mt-4">
              <a href="/dashboard">Kembali ke Dashboard</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Pembayaran Pinjaman</h1>
        <p className="text-muted-foreground">
          Lakukan pembayaran pinjaman Anda dengan mudah dan aman
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Summary */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rincian Pinjaman</CardTitle>
              <CardDescription>
                Informasi pinjaman yang sedang aktif
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nomor Pinjaman</p>
                  <p className="font-medium">{activeLoan.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Pinjaman</p>
                  <p className="font-medium">{formatCurrency(activeLoan.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sisa Pokok</p>
                  <p className="font-medium">{formatCurrency(activeLoan.remaining)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      activeLoan.nextPayment.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : activeLoan.nextPayment.status === 'overdue'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activeLoan.nextPayment.status === 'paid' ? 'Lunas' : 
                       activeLoan.nextPayment.status === 'overdue' ? 'Jatuh Tempo' : 'Menunggu Pembayaran'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Angsuran Berikutnya</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Jatuh Tempo</p>
                      <p className="font-medium">{formatDate(activeLoan.nextPayment.dueDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Jumlah</p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(activeLoan.nextPayment.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pembayaran</CardTitle>
              <CardDescription>
                Daftar pembayaran yang telah dilakukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeLoan.installments.map((installment) => (
                  <div key={installment.number} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        installment.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {installment.status === 'paid' ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Clock className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Angsuran ke-{installment.number}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(installment.dueDate)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        installment.status === 'paid' ? 'text-green-600' : ''
                      }`}>
                        {formatCurrency(installment.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {installment.status === 'paid' ? 'Lunas' : 'Menunggu Pembayaran'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Pembayaran</CardTitle>
              <CardDescription>
                Pilih metode pembayaran dan isi detail pembayaran
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Metode Pembayaran</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih metode pembayaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Transfer Bank</SelectItem>
                      <SelectItem value="virtual_account">Virtual Account</SelectItem>
                      <SelectItem value="qris">QRIS</SelectItem>
                      <SelectItem value="credit_card">Kartu Kredit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentAmount">Jumlah Pembayaran</Label>
                  <Input
                    id="paymentAmount"
                    name="paymentAmount"
                    type="number"
                    value={formData.paymentAmount}
                    onChange={handleInputChange}
                    min={activeLoan.nextPayment.amount}
                    max={activeLoan.remaining}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimal pembayaran: {formatCurrency(activeLoan.nextPayment.amount)}
                  </p>
                </div>

                {paymentMethod === 'bank_transfer' && (
                  <div className="space-y-2">
                    <Label>Upload Bukti Transfer</Label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="text-sm text-gray-500">
                            {formData.paymentProof ? (
                              <span className="font-medium">{formData.paymentProof.name}</span>
                            ) : (
                              <>
                                <span className="font-semibold">Klik untuk mengunggah</span>
                                <span className="text-xs block">Format: JPG, PNG, PDF (Maks. 5MB)</span>
                              </>
                            )}
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        Lanjutkan Pembayaran
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Petunjuk Pembayaran</h4>
                <ul className="text-xs space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span>1.</span>
                    <span>Pilih metode pembayaran yang diinginkan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>2.</span>
                    <span>Masukkan jumlah pembayaran (minimal sesuai tagihan)</span>
                  </li>
                  {paymentMethod === 'bank_transfer' && (
                    <>
                      <li className="flex items-start gap-2">
                        <span>3.</span>
                        <span>Lakukan transfer ke rekening tujuan yang akan ditampilkan</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>4.</span>
                        <span>Unggah bukti transfer</span>
                      </li>
                    </>
                  )}
                  <li className="flex items-start gap-2">
                    <span>{paymentMethod === 'bank_transfer' ? '5.' : '3.'}</span>
                    <span>Klik tombol "Lanjutkan Pembayaran"</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}