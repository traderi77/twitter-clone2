const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Command = "zrange" | "sismember" | "get" | "smembers";

export async function fetchRedis(
  command: Command,
  ...args: (string | number)[]
) {
  const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join("/")}`;

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

export async function setRedis(
  key: string,
  email: string,
  username: string,
  id: string,
  name: string,
  hashedPassword: string
): Promise<void> {
  const commandUrl = `${upstashRedisRestUrl}/set/${key}`;

  const response = await fetch(commandUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },

    body: JSON.stringify({
      value: {
        email,
        username,
        id,
        name,
        hashedPassword,
      },
    }),

    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Error executing Redis SET command: ${response.statusText}`
    );
  }
}
