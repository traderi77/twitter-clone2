import ChatInput from '@/components/messages/ChatInput'
import Messages from '@/components/messages/Messages'
import { fetchRedis } from '@/libs/helpers/redis'
import { messageArrayValidator } from '@/lib/validations/message'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import useCurrentUser from '@/hooks/useCurrentUser'
import { useEffect, useState, FC } from 'react'



interface PageProps {
  params: {
    chatId: string
  }
}

async function getChatMessages(chatId: string): Promise<Message[]> {
  try {
    const results: string[] = await fetchRedis('zrange', `chat:${chatId}:messages`, 0, -1);
    const dbMessages = results.map((message) => JSON.parse(message) as Message);
    
    const messagesWithReceiverId = dbMessages.map((message) => ({
      ...message,
      receiverId: chatId.split('--').find((id) => id !== message.senderId) || '',
    }));

    const reversedDbMessages = messagesWithReceiverId.reverse();
    const messages = messageArrayValidator.parse(reversedDbMessages);

    return messages;
  } catch (error) {
    throw new Error('Error fetching messages');
  }
}




const ChatPage: FC<PageProps> = ({ params }) => {
  const { chatId } = params;
  const { data: currentUser } = useCurrentUser();
  const [chatPartner, setChatPartner] = useState<User | null>(null);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        notFound(); // or handle the case where currentUser is not available
        return;
      }

      const { user } = currentUser;
      const [userId1, userId2] = chatId.split('--');

      if (user.id !== userId1 && user.id !== userId2) {
        return;
      }

      const chatPartnerId = user.id === userId1 ? userId2 : userId1;

      try {
        const chatPartnerRaw = (await fetchRedis(
          'get',
          `user:${chatPartnerId}`
        )) as string;
        const chatPartnerData = JSON.parse(chatPartnerRaw) as User;
        setChatPartner(chatPartnerData);

        const messages = await getChatMessages(chatId);
        setInitialMessages(messages);
      } catch (error) {
        console.error('Error fetching data:', error);
        notFound();
      }
    };

    fetchData();
  }, [chatId, currentUser]);
return (
    <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
      <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
        <div className='relative flex items-center space-x-4'>
          <div className='relative'>
            <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
            </div>
          </div>

          <div className='flex flex-col leading-tight'>
            <div className='text-xl flex items-center'>
              <span className='text-gray-700 mr-3 font-semibold'>
                {chatPartner.name}
              </span>
            </div>

            <span className='text-sm text-gray-600'>{chatPartner.email}</span>
          </div>
        </div>
      </div>

      <Messages
        chatId={chatId}
        chatPartner={chatPartner}
        sessionId={currentUser.id}
        initialMessages={initialMessages}
      />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  )
}

export default ChatPage
