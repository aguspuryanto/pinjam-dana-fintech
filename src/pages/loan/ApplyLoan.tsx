import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, DollarSign, Clock, FileText, Upload, Calendar, User, CreditCard } from "lucide-react";

export default function ApplyLoan() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    amount: 500000,
    tenor: 3,
    purpose: "",
    salary: "",
    occupation: "",
    kkFile: null as File | null,
    salarySlipFile: null as File | null,
  });

  const loanPurposes = [
    "Modal Usaha",
    "Kebutuhan Darurat",
    "Pendidikan",
    "Kesehatan",
    "Pernikahan",
    "Renovasi Rumah",
    "Lainnya"
  ];

  const tenors = [
    { value: 1, label: "1 Bulan" },
    { value: 3, label: "3 Bulan" },
    { value: 6, label: "6 Bulan" },
    { value: 12, label: "12 Bulan" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'kkFile' | 'salarySlipFile') => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const calculateInstallment = () => {
    // Simple interest calculation (example: 2% per month)
    const interestRate = 0.02;
    const totalInterest = formData.amount * interestRate * formData.tenor;
    const totalPayment = formData.amount + totalInterest;
    return Math.ceil(totalPayment / formData.tenor);
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
      setError("Terjadi kesalahan saat mengajukan pinjaman. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <CardTitle>Pengajuan Pinjaman Berhasil</CardTitle>
            <CardDescription>
              Terima kasih telah mengajukan pinjaman. Tim kami akan menghubungi Anda dalam 1x24 jam.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Nomor Pengajuan</p>
              <p className="text-lg font-mono font-bold">L-{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
            <Button onClick={() => navigate('/dashboard')} className="mt-4">
              Kembali ke Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Ajukan Pinjaman</h1>
        <p className="text-muted-foreground">
          Isi formulir di bawah untuk mengajukan pinjaman
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Detail Pinjaman</CardTitle>
              <CardDescription>
                {step === 1 ? "Informasi pinjaman" : "Data diri dan dokumen"}
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              Langkah {step} dari 2
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="amount" className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4" />
                    Jumlah Pinjaman
                  </Label>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Rp 500.000</span>
                      <span>Rp 10.000.000</span>
                    </div>
                    <Slider
                      id="amount"
                      min={500000}
                      max={10000000}
                      step={50000}
                      value={[formData.amount]}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, amount: value[0] }))}
                      className="py-4"
                    />
                    <div className="flex justify-center">
                      <div className="text-2xl font-bold">
                        Rp {formData.amount.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenor" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Tenor Pinjaman
                  </Label>
                  <Select
                    value={formData.tenor.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, tenor: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tenor pinjaman" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenors.map((tenor) => (
                        <SelectItem key={tenor.value} value={tenor.value.toString()}>
                          {tenor.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Tujuan Pinjaman
                  </Label>
                  <Select
                    value={formData.purpose}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, purpose: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tujuan pinjaman" />
                    </SelectTrigger>
                    <SelectContent>
                      {loanPurposes.map((purpose) => (
                        <SelectItem key={purpose} value={purpose}>
                          {purpose}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 flex justify-between">
                  <div></div>
                  <Button type="button" onClick={() => setStep(2)}>
                    Selanjutnya
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informasi Pribadi
                  </h3>
                  <div className="space-y-4 pl-6">
                    <div>
                      <Label htmlFor="occupation">Pekerjaan</Label>
                      <Input
                        id="occupation"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        placeholder="Contoh: Karyawan Swasta"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="salary">Pendapatan per Bulan</Label>
                      <Input
                        id="salary"
                        name="salary"
                        type="number"
                        value={formData.salary}
                        onChange={handleInputChange}
                        placeholder="Contoh: 5000000"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Dokumen Pendukung
                  </h3>
                  
                  <div className="space-y-2 pl-6">
                    <Label>Upload Kartu Keluarga</Label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="text-sm text-gray-500">
                            {formData.kkFile ? (
                              <span className="font-medium">{formData.kkFile.name}</span>
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
                          onChange={(e) => handleFileChange(e, 'kkFile')}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2 pl-6">
                    <Label>Slip Gaji (Opsional)</Label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="text-sm text-gray-500">
                            {formData.salarySlipFile ? (
                              <span className="font-medium">{formData.salarySlipFile.name}</span>
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
                          onChange={(e) => handleFileChange(e, 'salarySlipFile')}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium">Ringkasan Pinjaman</h4>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Jumlah Pinjaman</span>
                    <span className="font-medium">Rp {formData.amount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tenor</span>
                    <span className="font-medium">{formData.tenor} Bulan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Angsuran per Bulan</span>
                    <span className="font-medium">Rp {calculateInstallment().toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Kembali
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Mengajukan..." : "Ajukan Pinjaman"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}