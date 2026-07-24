export default {
  async fetch(request, env) {
    
    // ===== تنظیمات با متغیرهای محیطی =====
    const BOT_TOKEN = env.BOT_TOKEN;
    const ADMIN_ID = env.ADMIN_ID;
    
    // ===== بررسی وجود متغیرها =====
    if (!BOT_TOKEN || !ADMIN_ID) {
      return new Response("❌ خطا: متغیرهای BOT_TOKEN و ADMIN_ID را تنظیم کنید!", {
        status: 500
      });
    }
    
    // ===== تشخیص استفاده از KV =====
    const useKV = env.MY_KV ? true : false;
    
    // ===== توابع ذخیره‌سازی =====
    async function getBlockedUsers() {
      if (useKV) {
        const data = await env.MY_KV.get('blocked_users', 'json');
        return data || [];
      } else {
        if (!globalThis._botData) globalThis._botData = { blockedUsers: [] };
        return globalThis._botData.blockedUsers || [];
      }
    }

    async function setBlockedUsers(users) {
      if (useKV) {
        await env.MY_KV.put('blocked_users', JSON.stringify(users));
      } else {
        if (!globalThis._botData) globalThis._botData = { blockedUsers: [] };
        globalThis._botData.blockedUsers = users;
      }
    }

    async function getAllUsers() {
      if (useKV) {
        const data = await env.MY_KV.get('all_users', 'json');
        return data || [];
      } else {
        if (!globalThis._botData) globalThis._botData = { allUsers: [] };
        return globalThis._botData.allUsers || [];
      }
    }

    async function saveUser(userId) {
      const users = await getAllUsers();
      if (!users.includes(String(userId))) {
        users.push(String(userId));
        if (useKV) {
          await env.MY_KV.put('all_users', JSON.stringify(users));
        } else {
          if (!globalThis._botData) globalThis._botData = { allUsers: [] };
          globalThis._botData.allUsers = users;
        }
      }
    }

    async function getUserMessageCount(userId) {
      if (useKV) {
        const count = await env.MY_KV.get(`msg_count_${userId}`, 'json');
        return count || 0;
      } else {
        if (!globalThis._botData) globalThis._botData = { messageCounts: {} };
        return globalThis._botData.messageCounts[String(userId)] || 0;
      }
    }

    async function incrementMessageCount(userId) {
      const count = await getUserMessageCount(userId);
      const newCount = count + 1;
      if (useKV) {
        await env.MY_KV.put(`msg_count_${userId}`, JSON.stringify(newCount));
      } else {
        if (!globalThis._botData) globalThis._botData = { messageCounts: {} };
        globalThis._botData.messageCounts[String(userId)] = newCount;
      }
    }

    async function getTotalMessages() {
      if (useKV) {
        const total = await env.MY_KV.get('total_messages', 'json');
        return total || 0;
      } else {
        if (!globalThis._botData) globalThis._botData = { totalMessages: 0 };
        return globalThis._botData.totalMessages || 0;
      }
    }

    async function incrementTotalMessages() {
      const total = await getTotalMessages();
      const newTotal = total + 1;
      if (useKV) {
        await env.MY_KV.put('total_messages', JSON.stringify(newTotal));
      } else {
        if (!globalThis._botData) globalThis._botData = { totalMessages: 0 };
        globalThis._botData.totalMessages = newTotal;
      }
    }

    // ===== توابع ارسال =====
    async function sendMessage(token, chatId, text, parseMode = null, replyMarkup = null) {
      const payload = { chat_id: chatId, text: text };
      if (parseMode) payload.parse_mode = parseMode;
      if (replyMarkup) payload.reply_markup = replyMarkup;
      
      return fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    async function forwardMessage(token, fromChatId, toChatId, messageId) {
      return fetch(`https://api.telegram.org/bot${token}/forwardMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_chat_id: fromChatId,
          chat_id: toChatId,
          message_id: messageId
        })
      });
    }

    async function sendPhoto(token, chatId, photo, caption = "", replyMarkup = null) {
      const payload = {
        chat_id: chatId,
        photo: photo,
        caption: caption
      };
      if (replyMarkup) payload.reply_markup = replyMarkup;
      
      return fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    async function sendVideo(token, chatId, video, caption = "", replyMarkup = null) {
      const payload = {
        chat_id: chatId,
        video: video,
        caption: caption
      };
      if (replyMarkup) payload.reply_markup = replyMarkup;
      
      return fetch(`https://api.telegram.org/bot${token}/sendVideo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    async function sendDocument(token, chatId, document, caption = "", replyMarkup = null) {
      const payload = {
        chat_id: chatId,
        document: document,
        caption: caption
      };
      if (replyMarkup) payload.reply_markup = replyMarkup;
      
      return fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    async function sendAudio(token, chatId, audio, caption = "", replyMarkup = null) {
      const payload = {
        chat_id: chatId,
        audio: audio,
        caption: caption
      };
      if (replyMarkup) payload.reply_markup = replyMarkup;
      
      return fetch(`https://api.telegram.org/bot${token}/sendAudio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    async function sendVoice(token, chatId, voice, caption = "", replyMarkup = null) {
      const payload = {
        chat_id: chatId,
        voice: voice,
        caption: caption
      };
      if (replyMarkup) payload.reply_markup = replyMarkup;
      
      return fetch(`https://api.telegram.org/bot${token}/sendVoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    async function sendSticker(token, chatId, sticker) {
      return fetch(`https://api.telegram.org/bot${token}/sendSticker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          sticker: sticker
        })
      });
    }

    async function sendVideoNote(token, chatId, videoNote) {
      return fetch(`https://api.telegram.org/bot${token}/sendVideoNote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          video_note: videoNote
        })
      });
    }

    async function sendChatAction(token, chatId, action) {
      return fetch(`https://api.telegram.org/bot${token}/sendChatAction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          action: action
        })
      });
    }

    async function answerCallbackQuery(token, callbackQueryId, text, showAlert = false) {
      return fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callback_query_id: callbackQueryId,
          text: text,
          show_alert: showAlert
        })
      });
    }

    // ===== کیبورد مدیریت =====
    function getAdminKeyboard(userId) {
      return {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🚫 بلاک کاربر", callback_data: `block_${userId}` }
            ]
          ]
        }
      };
    }

    // ===== مدیریت Callback =====
    async function handleCallback(callbackQuery) {
      const data = callbackQuery.data;
      const chatId = callbackQuery.message.chat.id;
      const userId = callbackQuery.from.id;
      const callbackId = callbackQuery.id;

      if (String(userId) !== String(ADMIN_ID)) {
        await answerCallbackQuery(BOT_TOKEN, callbackId, "⛔ شما دسترسی ندارید!", true);
        return;
      }

      if (data.startsWith("block_")) {
        const targetId = data.split('_')[1];
        const blocked = await getBlockedUsers();
        
        if (!blocked.includes(targetId)) {
          blocked.push(targetId);
          await setBlockedUsers(blocked);
          
          await sendMessage(BOT_TOKEN, targetId, "⛔ شما توسط ادمین مسدود شدید!");
          await sendMessage(BOT_TOKEN, chatId, `✅ کاربر ${targetId} با موفقیت مسدود شد.`);
          await answerCallbackQuery(BOT_TOKEN, callbackId, "✅ کاربر مسدود شد", false);
        } else {
          await sendMessage(BOT_TOKEN, chatId, `⚠️ کاربر ${targetId} قبلاً مسدود شده است.`);
          await answerCallbackQuery(BOT_TOKEN, callbackId, "⚠️ قبلاً مسدود شده", true);
        }
      }
    }

    // ===== تابع تشخیص نوع پیام و ارسال به ادمین =====
    async function sendMessageToAdmin(userId, message, messageId) {
      const caption = 
`📩 پیام جدید از کاربر ${userId}
📅 تاریخ: ${new Date().toLocaleDateString('fa-IR')}
📊 تعداد پیام‌ها: ${await getUserMessageCount(userId)}`;

      // تشخیص نوع پیام
      if (message.text) {
        // پیام متنی - فوروارد میکنیم
        await forwardMessage(BOT_TOKEN, userId, ADMIN_ID, messageId);
        
        // ارسال اطلاعات همراه با دکمه بلاک
        await sendMessage(
          BOT_TOKEN,
          ADMIN_ID,
          `${caption}\n\n🔄 برای پاسخ، روی پیام فوروارد شده ریپلی کنید`,
          null,
          getAdminKeyboard(userId).reply_markup
        );
        
      } else if (message.photo) {
        // عکس
        const photo = message.photo[message.photo.length - 1].file_id;
        await sendPhoto(BOT_TOKEN, ADMIN_ID, photo, caption, getAdminKeyboard(userId).reply_markup);
        
      } else if (message.video) {
        // ویدیو
        await sendVideo(BOT_TOKEN, ADMIN_ID, message.video.file_id, caption, getAdminKeyboard(userId).reply_markup);
        
      } else if (message.document) {
        // فایل
        const fileName = message.document.file_name || "فایل";
        await sendDocument(BOT_TOKEN, ADMIN_ID, message.document.file_id, `${caption}\n📎 ${fileName}`, getAdminKeyboard(userId).reply_markup);
        
      } else if (message.audio) {
        // صدا
        const title = message.audio.title || "صدا";
        await sendAudio(BOT_TOKEN, ADMIN_ID, message.audio.file_id, `${caption}\n🎵 ${title}`, getAdminKeyboard(userId).reply_markup);
        
      } else if (message.voice) {
        // پیام صوتی
        await sendVoice(BOT_TOKEN, ADMIN_ID, message.voice.file_id, caption, getAdminKeyboard(userId).reply_markup);
        
      } else if (message.animation) {
        // گیف - فوروارد میکنیم
        await forwardMessage(BOT_TOKEN, userId, ADMIN_ID, messageId);
        await sendMessage(
          BOT_TOKEN,
          ADMIN_ID,
          `${caption}\n🎬 گیف\n\n🔄 برای پاسخ، روی پیام فوروارد شده ریپلی کنید`,
          null,
          getAdminKeyboard(userId).reply_markup
        );
        
      } else if (message.sticker) {
        // استیکر
        await sendSticker(BOT_TOKEN, ADMIN_ID, message.sticker.file_id);
        await sendMessage(
          BOT_TOKEN,
          ADMIN_ID,
          `${caption}\n🎨 استیکر`,
          null,
          getAdminKeyboard(userId).reply_markup
        );
        
      } else if (message.video_note) {
        // ویدیو نوت
        await sendVideoNote(BOT_TOKEN, ADMIN_ID, message.video_note.file_id);
        await sendMessage(
          BOT_TOKEN,
          ADMIN_ID,
          `${caption}\n🎥 ویدیو نوت`,
          null,
          getAdminKeyboard(userId).reply_markup
        );
        
      } else {
        // سایر موارد (مکان، تماس و...) - فوروارد میکنیم
        await forwardMessage(BOT_TOKEN, userId, ADMIN_ID, messageId);
        await sendMessage(
          BOT_TOKEN,
          ADMIN_ID,
          `${caption}\n📨 پیام دیگر\n\n🔄 برای پاسخ، روی پیام فوروارد شده ریپلی کنید`,
          null,
          getAdminKeyboard(userId).reply_markup
        );
      }
    }

    // ===== مدیریت پیام‌ها =====
    async function handleMessage(message) {
      const userId = message.chat.id;
      const text = message.text || "";
      const messageId = message.message_id;

      await saveUser(userId);

      // بررسی مسدودیت
      const blocked = await getBlockedUsers();
      if (blocked.includes(String(userId)) && String(userId) !== String(ADMIN_ID)) {
        await sendMessage(BOT_TOKEN, userId, "⛔ شما مسدود شده‌اید!");
        return;
      }

      // ===== پیام شروع =====
      if (text === "/start") {
        await sendChatAction(BOT_TOKEN, userId, "typing");
        
        let welcomeText = 
          `👋 *خوش آمدید به ربات پیام‌رسان ناشناس!*\n\n` +
          `🔒 پیام‌های شما کاملاً ناشناس به ادمین ارسال می‌شود.\n` +
          `📨 برای ارسال پیام، فقط کافیست پیام خود را تایپ کنید.\n` +
          `📎 می‌توانید عکس، ویدیو، فایل، صدا، گیف و ... ارسال کنید.`;
        
        if (String(userId) === String(ADMIN_ID)) {
          welcomeText += `\n\n👑 *پنل مدیریت*\n` +
            `• پاسخ به پیام‌ها با ریپلی زدن\n` +
            `• مدیریت کاربران با دکمه بلاک\n` +
            `• مشاهده آمار با دستور /stats\n` +
            `• رفع مسدودی با /unblock [آیدی]\n` +
            `• لیست مسدود شده‌ها با /blocked`;
        }
        
        await sendMessage(BOT_TOKEN, userId, welcomeText, "Markdown");
        return;
      }

      // ===== دستورات ادمین =====
      if (String(userId) === String(ADMIN_ID)) {
        
        // آمار
        if (text === "/stats") {
          const allUsers = await getAllUsers();
          const totalMsg = await getTotalMessages();
          const blocked = await getBlockedUsers();
          
          await sendMessage(
            BOT_TOKEN,
            userId,
            `📊 *آمار کامل ربات*\n\n` +
            `👥 کل کاربران: ${allUsers.length}\n` +
            `📨 کل پیام‌ها: ${totalMsg}\n` +
            `🚫 مسدود شده‌ها: ${blocked.length}\n` +
            `🟢 کاربران فعال: ${allUsers.length - blocked.length}\n\n` +
            `📅 تاریخ: ${new Date().toLocaleDateString('fa-IR')}`,
            "Markdown"
          );
          return;
        }

        // لیست مسدود شده‌ها
        if (text === "/blocked") {
          const blocked = await getBlockedUsers();
          if (blocked.length === 0) {
            await sendMessage(BOT_TOKEN, userId, "✅ هیچ کاربری مسدود نیست.");
          } else {
            let list = "🚫 *لیست کاربران مسدود شده:*\n\n";
            for (const id of blocked) {
              list += `• ${id}\n`;
            }
            await sendMessage(BOT_TOKEN, userId, list, "Markdown");
          }
          return;
        }

        // رفع مسدودی
        if (text.startsWith("/unblock")) {
          const targetId = text.replace("/unblock", "").trim();
          if (!targetId) {
            await sendMessage(
              BOT_TOKEN,
              userId,
              "⚠️ لطفاً آیدی کاربر را وارد کنید:\n" +
              "مثال: /unblock 123456789\n\n" +
              "برای دیدن لیست مسدود شده‌ها از /blocked استفاده کنید."
            );
            return;
          }
          
          const blocked = await getBlockedUsers();
          const index = blocked.indexOf(targetId);
          if (index !== -1) {
            blocked.splice(index, 1);
            await setBlockedUsers(blocked);
            await sendMessage(BOT_TOKEN, targetId, "✅ شما توسط ادمین رفع مسدود شدید!");
            await sendMessage(BOT_TOKEN, userId, `✅ کاربر ${targetId} رفع مسدود شد.`);
          } else {
            await sendMessage(
              BOT_TOKEN,
              userId,
              `⚠️ کاربر ${targetId} مسدود نیست.\n\n` +
              `برای دیدن لیست مسدود شده‌ها از /blocked استفاده کنید.`
            );
          }
          return;
        }

        // برودکست
        if (text.startsWith("/broadcast")) {
          const broadcastText = text.replace("/broadcast", "").trim();
          if (!broadcastText) {
            await sendMessage(
              BOT_TOKEN,
              userId,
              "⚠️ لطفاً پیام را وارد کنید:\nمثال: /broadcast سلام به همه"
            );
            return;
          }
          
          const allUsers = await getAllUsers();
          let successCount = 0;
          let failCount = 0;
          
          await sendMessage(BOT_TOKEN, userId, `📢 در حال ارسال به ${allUsers.length} کاربر...`);
          
          for (const user of allUsers) {
            try {
              await sendMessage(BOT_TOKEN, user, `📢 *پیام گروهی از ادمین:*\n\n${broadcastText}`, "Markdown");
              successCount++;
            } catch (e) {
              failCount++;
            }
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          
          await sendMessage(
            BOT_TOKEN,
            userId,
            `✅ برودکست کامل شد!\n\n✓ موفق: ${successCount}\n✗ ناموفق: ${failCount}`
          );
          return;
        }

        // خروجی گرفتن از کاربران
        if (text === "/export") {
          const allUsers = await getAllUsers();
          const data = JSON.stringify(allUsers, null, 2);
          await sendDocument(
            BOT_TOKEN,
            userId,
            `data:text/json;base64,${btoa(data)}`,
            `users_${Date.now()}.json`
          );
          return;
        }
      }

      // ===== پاسخ ادمین به کاربر (با ریپلی) =====
      if (String(userId) === String(ADMIN_ID) && message.reply_to_message) {
        const repliedMessage = message.reply_to_message;
        
        // اگر روی پیام فوروارد شده ریپلی زده
        if (repliedMessage.forward_from) {
          const targetId = repliedMessage.forward_from.id;
          
          const blocked = await getBlockedUsers();
          if (blocked.includes(String(targetId))) {
            await sendMessage(BOT_TOKEN, userId, "⚠️ این کاربر مسدود است! نمی‌توانید به او پاسخ دهید.");
            return;
          }
          
          await sendMessage(BOT_TOKEN, targetId, `📨 *پاسخ ادمین:*\n\n${text}`, "Markdown");
          await sendMessage(BOT_TOKEN, userId, "✅ پاسخ با موفقیت ارسال شد.");
          return;
        }
      }

      // ===== ارسال پیام کاربر به ادمین =====
      await incrementMessageCount(userId);
      await incrementTotalMessages();

      // ارسال به ادمین با تشخیص نوع پیام
      await sendMessageToAdmin(userId, message, messageId);

      // ===== تایید برای کاربر =====
      await sendChatAction(BOT_TOKEN, userId, "typing");
      await sendMessage(
        BOT_TOKEN,
        userId,
        `✅ *پیام شما دریافت شد!*\n\n⏳ در اسرع وقت پاسخ داده می‌شود.`,
        "Markdown"
      );
    }

    // ===== هندلر اصلی =====
    try {
      if (request.method !== "POST") {
        return new Response("🤖 ربات پیام‌رسان ناشناس فعال است!", {
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      }

      const update = await request.json();

      if (update.callback_query) {
        await handleCallback(update.callback_query);
        return new Response("ok");
      }

      if (update.message) {
        await handleMessage(update.message);
        return new Response("ok");
      }

      return new Response("ok");
      
    } catch (error) {
      console.error("Error:", error);
      try {
        await sendMessage(
          BOT_TOKEN,
          ADMIN_ID,
          `⚠️ *خطا در ربات*\n\n📝 ${error.message}\n📅 ${new Date().toLocaleDateString('fa-IR')}`,
          "Markdown"
        );
      } catch (e) {}
      
      return new Response("error", { status: 500 });
    }
  }
};
