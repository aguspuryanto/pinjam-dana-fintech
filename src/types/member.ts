export interface Member {
  name: string;
  email: string;
  phone: string;
  password: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'suspended';
  role?: string; // Optional since it's not in your current data but might be used in the future
  verifikasi_kyc: [{
    nik: string;
    name: string;
    address: string;
    phone: string;
    ktpFile: string;
    selfieFile: string;
  }];
  pinjaman_limit: {
    maximum: number;
  };
  pinjaman_aktif: [];
  pinjaman_riwayat: [];
  salary: number;
  occupation: string;
  kkFile: string;
  salarySlipFile: string;
}

export type MemberInput = Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
  passwordConfirmation?: string; // For registration forms
};

export type MemberUpdate = Partial<Omit<Member, 'id' | 'email' | 'createdAt' | 'updatedAt'>>;
