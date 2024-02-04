const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Command = "zrange" | "sismember" | "get" | "smembers";

export async function fetchRedis(
  command: Command,
  ...args: (string | number)[]
) {
  const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join("/")}`;

  console.log("commandUrl", commandUrl);

  const response = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error executing Redis command: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result;
}

export async function setRedis(key: string, ...values: any[]): Promise<void> {
  const commandUrl = `${upstashRedisRestUrl}/set/${key}`;

  const value =
    values.length === 1
      ? values[0]
      : JSON.stringify({
          data: {
            email: values[0],
            username: values[1],
            id: values[2],
            name: values[3],
            hashedPassword: values[4],
          },
        });

  const response = await fetch(commandUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: value,

    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Error executing Redis SET command: ${response.statusText}`
    );
  }
}
