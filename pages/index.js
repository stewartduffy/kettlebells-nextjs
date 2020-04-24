import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Index() {
  const { data, error } = useSWR("/api/users", fetcher);
  console.log("data: ", data);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return <div>{`Cookie from response: "${data}"`}</div>;
}
