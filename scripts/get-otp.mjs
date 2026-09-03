import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

const dbUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_4uFnyHiz1XDW@ep-dark-grass-ao6fnhnm-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(dbUrl);

async function main() {
  console.log("\n=======================================================");
  console.log(" 🔍 TAJ SAAS - ACTIVE OTP RECOVERY CODES (DEV TOOL)");
  console.log("=======================================================\n");

  const records = await sql`
    SELECT * FROM verification 
    WHERE identifier LIKE 'reset_otp:%' 
      AND expires_at > NOW() 
    ORDER BY created_at DESC 
    LIMIT 5
  `;

  if (records.length === 0) {
    console.log("ℹ️  Tidak ada kode OTP yang sedang aktif saat ini.\n");
    return;
  }

  for (const record of records) {
    const email = record.identifier.replace("reset_otp:", "");
    let matchedOtp = null;

    for (let i = 100000; i <= 999999; i++) {
      const h = crypto.createHash('sha256').update(i.toString() + ':' + email).digest('hex');
      if (h === record.value) {
        matchedOtp = i.toString();
        break;
      }
    }

    const remainingMs = new Date(record.expires_at).getTime() - Date.now();
    const remainingMins = Math.max(0, Math.ceil(remainingMs / (60 * 1000)));

    console.log(`📧 Email Akun : ${email}`);
    console.log(`🔑 Kode OTP   : \x1b[32m\x1b[1m${matchedOtp || "[Unknown]"}\x1b[0m`);
    console.log(`⏱️  Kedaluwarsa: ${remainingMins} Menit lagi (${new Date(record.expires_at).toLocaleTimeString("id-ID")})`);
    console.log("-------------------------------------------------------");
  }
  console.log("");
}

main().catch(err => {
  console.error("Error reading OTP:", err);
  process.exit(1);
});
