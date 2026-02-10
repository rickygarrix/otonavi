export async function uploadAvatar({
  file,
  userId,
}: {
  file: File;
  userId: string;
}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'avatar');
  formData.append('id', userId);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_R2_WORKER_URL}/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error('Upload failed');
  }

  return res.json() as Promise<{
    ok: boolean;
    key: string;
  }>;
}