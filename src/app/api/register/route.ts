import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const filePath = path.join(process.cwd(), 'src/data/member_28112025.json');
    
    // Read existing data
    let members = [];
    try {
      const fileData = await fs.readFile(filePath, 'utf-8');
      members = JSON.parse(fileData);
    } catch (error) {
      // If file doesn't exist or is empty, we'll start with an empty array
      console.log('Creating new members file...');
    }

    // Add new member
    members.push(data);
    
    // Save back to file
    await fs.writeFile(filePath, JSON.stringify(members, null, 2));
    
    return NextResponse.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
