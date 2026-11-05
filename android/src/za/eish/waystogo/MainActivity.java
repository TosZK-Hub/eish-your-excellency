package za.eish.waystogo;
import android.app.Activity;import android.os.Bundle;import android.webkit.WebView;import android.webkit.WebSettings;import android.webkit.WebViewClient;import android.webkit.WebChromeClient;import android.view.Window;import android.view.WindowManager;import android.graphics.Color;
public class MainActivity extends Activity{
 private WebView w;
 @Override protected void onCreate(Bundle b){super.onCreate(b);requestWindowFeature(Window.FEATURE_NO_TITLE);getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
  w=new WebView(this);w.setBackgroundColor(Color.parseColor("#f2c230"));WebSettings s=w.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setAllowFileAccess(true);s.setMediaPlaybackRequiresUserGesture(false);s.setDatabaseEnabled(true);
  w.setWebViewClient(new WebViewClient());w.setWebChromeClient(new WebChromeClient());setContentView(w);if(b!=null)w.restoreState(b);else w.loadUrl("file:///android_asset/www/index.html");}
 @Override protected void onSaveInstanceState(Bundle o){super.onSaveInstanceState(o);w.saveState(o);}
 @Override protected void onPause(){super.onPause();w.onPause();w.evaluateJavascript("window.dispatchEvent(new Event('blur'))",null);}
 @Override protected void onResume(){super.onResume();w.onResume();}
 @Override public void onBackPressed(){if(w.canGoBack())w.goBack();else super.onBackPressed();}
}
