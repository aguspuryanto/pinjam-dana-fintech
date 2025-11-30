import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Banknote, Trash2, Plus, Edit } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type BankAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isPrimary: boolean;
};

export default function BankAccount() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Sample bank list (can be fetched from API)
  const bankList = [
    { code: "bca", name: "BCA" },
    { code: "bni", name: "BNI" },
    { code: "bri", name: "BRI" },
    { code: "mandiri", name: "Bank Mandiri" },
    { code: "cimb", name: "CIMB Niaga" },
    { code: "bsi", name: "BSI" },
  ];

  // Sample saved accounts (can be fetched from API)
  const [savedAccounts, setSavedAccounts] = useState<BankAccount[]>([
    {
      id: "1",
      bankName: "BCA",
      accountNumber: "1234567890",
      accountName: "John Doe",
      isPrimary: true,
    },
  ]);

  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBankSelect = (value: string) => {
    setFormData(prev => ({ ...prev, bankName: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingId) {
        // Update existing account
        setSavedAccounts(prev =>
          prev.map(acc =>
            acc.id === editingId
              ? { ...formData, id: editingId, isPrimary: acc.isPrimary }
              : acc
          )
        );
      } else {
        // Add new account
        const newAccount: BankAccount = {
          id: Date.now().toString(),
          ...formData,
          isPrimary: savedAccounts.length === 0, // Set as primary if first account
        };
        setSavedAccounts(prev => [...prev, newAccount]);
      }

      // Reset form
      setFormData({ bankName: "", accountNumber: "", accountName: "" });
      setEditingId(null);
      setIsEditing(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (account: BankAccount) => {
    setFormData({
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      accountName: account.accountName,
    });
    setEditingId(account.id);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus rekening ini?")) {
      setSavedAccounts(prev => prev.filter(acc => acc.id !== id));
    }
  };

  const setAsPrimary = (id: string) => {
    setSavedAccounts(prev =>
      prev.map(acc => ({
        ...acc,
        isPrimary: acc.id === id,
      }))
    );
  };

  const cancelEdit = () => {
    setFormData({ bankName: "", accountNumber: "", accountName: "" });
    setEditingId(null);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Kelola Rekening Bank</h1>
        <p className="text-muted-foreground">
          Tambah atau kelola rekening bank untuk penarikan dana dan pembayaran
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isSuccess && (
        <Alert className="mb-6">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle>Berhasil!</AlertTitle>
          <AlertDescription>
            {editingId ? "Rekening berhasil diperbarui" : "Rekening berhasil ditambahkan"}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {/* Add/Edit Bank Account Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {editingId ? "Edit Rekening" : "Tambah Rekening Baru"}
                </CardTitle>
                <CardDescription>
                  {editingId
                    ? "Perbarui informasi rekening bank Anda"
                    : "Tambahkan rekening bank untuk penarikan dana dan pembayaran"}
                </CardDescription>
              </div>
              {!isEditing && (
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => {
                    if (isEditing) cancelEdit();
                    else setIsEditing(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isEditing ? "Batal" : "Tambah Rekening"}
                </Button>
              )}
            </div>
          </CardHeader>
          {(isEditing || editingId) && (
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Nama Bank</Label>
                  <Select
                    value={formData.bankName}
                    onValueChange={handleBankSelect}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankList.map(bank => (
                        <SelectItem key={bank.code} value={bank.name}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Nomor Rekening</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Contoh: 1234567890"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountName">Nama Pemilik Rekening</Label>
                  <Input
                    id="accountName"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleInputChange}
                    placeholder="Nama sesuai buku tabungan"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEdit}
                    disabled={isSubmitting}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Menyimpan..."
                      : editingId
                      ? "Perbarui Rekening"
                      : "Simpan Rekening"}
                  </Button>
                </div>
              </form>
            </CardContent>
          )}
        </Card>

        {/* Saved Bank Accounts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Rekening Tersimpan</h2>
          
          {savedAccounts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Banknote className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Belum ada rekening yang tersimpan</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {savedAccounts.map(account => (
                <Card key={account.id} className={account.isPrimary ? "border-blue-500" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{account.bankName}</h3>
                          {account.isPrimary && (
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                              Utama
                            </span>
                          )}
                        </div>
                        <p className="text-2xl font-bold mt-1">
                          {account.accountNumber.replace(/\d(?=\d{4})/g, "•")}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {account.accountName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!account.isPrimary && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAsPrimary(account.id)}
                            className="text-xs"
                          >
                            Jadikan Utama
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(account)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(account.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}