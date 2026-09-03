import { registerWebModule, NativeModule } from 'expo';

class UpiAppsModule extends NativeModule<{}> {
  async setValueAsync(value: string): Promise<void> {}
}

export default registerWebModule(UpiAppsModule, 'UpiAppsModule');
