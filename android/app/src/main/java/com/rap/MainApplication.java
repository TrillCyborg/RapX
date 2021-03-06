package com.rap;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.zxcpoiu.incallmanager.InCallManagerPackage;
import com.audioStreaming.ReactNativeAudioStreamingPackage;
import com.oney.WebRTCModule.WebRTCModulePackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.rnfs.RNFSPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new InCallManagerPackage(),
            new ReactNativeAudioStreamingPackage(),
            new WebRTCModulePackage(),
            new RNFetchBlobPackage(),
            new RNFSPackage(),
            new PickerPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
