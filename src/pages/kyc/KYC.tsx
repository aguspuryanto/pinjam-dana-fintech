import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Upload, Clock } from "lucide-react";
import { useLocalStorage } from '@/useLocalStorage'
import { Member } from '@/types/member'

export default function KYC() {
  const [formData, setFormData] = useState({
    nik: "",
    name: "",
    address: "",
    phone: "",
    ktpFile: "",
    selfieFile: "",
    submittedAt: "",
    status: ""
  });
  
  const [userEmail] = useLocalStorage('userEmail', '')

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<Member | null>(null)
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/members')
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        const members = await response.json()
        const foundUser = members.find((member: Member) => member.email === userEmail)
        
        if (foundUser) {
          const userData: Member = {
            ...foundUser,
            role: foundUser.role || 'Member',
            status: foundUser.status || 'active',
            createdAt: foundUser.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          setUser(userData)
          // If verifikasi_kyc exists and has data, use it. Otherwise, use empty values
          if (userData.verifikasi_kyc && userData.verifikasi_kyc.length > 0) {
            const kycData = userData.verifikasi_kyc[0];
            setFormData({
              nik: kycData.nik || "",
              name: kycData.name || "",
              address: kycData.address || "",
              phone: kycData.phone || "",
              ktpFile: kycData.ktpFile || "",
              selfieFile: kycData.selfieFile || "",
              submittedAt: kycData.submittedAt || "",
              status: kycData.status || ""
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    if (userEmail) {
      fetchUserData()
    }
  }, [userEmail])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'ktpFile' | 'selfieFile') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
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

      // Get member ID from local storage or other authentication context
      // const memberId = localStorage.getItem('userEmail') || '';
      // console.log(memberId)

      // Update the member's verifikasi_kyc array with the new KYC data
      const response = await fetch(`api/members/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verifikasi_kyc: [{
            ...formData,
            submittedAt: new Date().toISOString(),
            status: 'pending',
          }]
        }),
      });
      
      // Update the user data in db.json via JSON Server API
      // const response = await fetch(`api/members/${memberId.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     verifikasi_kyc: [{
      //       ...formData,
      //       submittedAt: new Date().toISOString(),
      //       status: 'pending',
      //     }]
      //   })
      // });
      
      // if (!response.ok) {
      //   throw new Error('Gagal menyimpan data KYC');
      // }
      
      setIsSuccess(true);
    } catch (err) {
      setError("Terjadi kesalahan saat mengirim data. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto p-4">
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

  // Show pending verification status if exists
  if (user?.verifikasi_kyc?.length > 0 && user.verifikasi_kyc[0].status === 'pending') {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle>Verifikasi Sedang Diproses</CardTitle>
            <CardDescription>
              Data verifikasi Anda sedang dalam proses pengecekan. 
              Tim kami akan memverifikasi data Anda dalam 1x24 jam.
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
    <div className="container mx-auto p-4">
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