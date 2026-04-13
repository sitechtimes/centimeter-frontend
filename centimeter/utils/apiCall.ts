export async function apiCall<ApiResponse>(url: string, options: RequestInit): Promise<{ ok: boolean; status: number; data?: ApiResponse }> {
  const res = await fetch(url, options);
  let data: ApiResponse | undefined = undefined;
  try {
    data = await res.json();
  } catch (e){
    console.log(`Response is not JSON: ${e}`);
  }
  return { ok: res.ok, status: res.status, data };
}
