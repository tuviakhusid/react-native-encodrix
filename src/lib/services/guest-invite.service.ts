import * as SecureStore from "expo-secure-store";

const GUEST_INVITE_CODE_KEY = "guest_invite_code";

export const guestInviteService = {
  async getInviteCode(): Promise<string | null> {
    return SecureStore.getItemAsync(GUEST_INVITE_CODE_KEY);
  },

  async setInviteCode(code: string): Promise<void> {
    await SecureStore.setItemAsync(GUEST_INVITE_CODE_KEY, code.trim());
  },

  async clearInviteCode(): Promise<void> {
    await SecureStore.deleteItemAsync(GUEST_INVITE_CODE_KEY);
  },

  async hasInviteCode(): Promise<boolean> {
    const code = await this.getInviteCode();
    return !!code && code.length > 0;
  },
};

export default guestInviteService;
