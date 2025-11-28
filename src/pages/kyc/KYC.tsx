import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Upload } from "lucide-react";

export default function KYC() {
  const [formData, setFormData] = useState({
    nik: "",
    name: "",
    address: "",
    phone: "",
    ktpFile: null as File | null,
    selfieFile: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'ktpFile' | 'selfieFile') => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setFormData({
        nik: "",
        name: "",
        address: "",
        phone: "",
        ktpFile: null,
        selfieFile: null,
      });
      
      setIsSuccess(true);
    } catch (err) {
      setError("Terjadi kesalahan saat mengirim data. Silakan coba lagi.");
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
            <CardTitle>Verifikasi Berhasil Dikirim</CardTitle>
            <CardDescription>
              Terima kasih telah melakukan verifikasi. Tim kami akan memproses data Anda dalam 1x24 jam.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="mt-4">
              <a href="/dashboard">Kembali ke Dashboard</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Verifikasi Identitas</h1>
        <p className="text-muted-foreground">
          Lengkapi data diri Anda untuk melanjutkan pengajuan pinjaman
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
          <CardTitle>Data Diri</CardTitle>
          <CardDescription>
            Pastikan data yang Anda masukkan sesuai dengan KTP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nik">NIK</Label>
                <Input
                  id="nik"
                  name="nik"
                  type="text"
                  required
                  value={formData.nik}
                  onChange={handleInputChange}
                  placeholder="Masukkan 16 digit NIK"
                  maxLength={16}
                />
              </div>

              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nama sesuai KTP"
                />
              </div>

              <div>
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Contoh: 081234567890"
                />
              </div>

              <div>
                <Label htmlFor="address">Alamat</Label>
                <textarea
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Alamat sesuai KTP"
                />
              </div>

              <div className="space-y-2">
                <Label>Unggah Foto KTP</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="ktp-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="text-sm text-gray-500">
                        {formData.ktpFile ? (
                          <span className="font-medium text-sm">{formData.ktpFile.name}</span>
                        ) : (
                          <>
                            <span className="font-semibold">Klik untuk mengunggah</span> atau drag and drop
                            <br />
                            <span className="text-xs">Format: JPG, PNG (Maks. 5MB)</span>
                          </>
                        )}
                      </p>
                    </div>
                    <input
                      id="ktp-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'ktpFile')}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Unggah Selfie dengan KTP</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="selfie-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="text-sm text-gray-500">
                        {formData.selfieFile ? (
                          <span className="font-medium text-sm">{formData.selfieFile.name}</span>
                        ) : (
                          <>
                            <span className="font-semibold">Klik untuk mengunggah</span> atau drag and drop
                            <br />
                            <span className="text-xs">Pastikan wajah dan KTP terlihat jelas</span>
                          </>
                        )}
                      </p>
                    </div>
                    <input
                      id="selfie-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      capture="user"
                      onChange={(e) => handleFileChange(e, 'selfieFile')}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Mengirim..." : "Kirim untuk Verifikasi"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}