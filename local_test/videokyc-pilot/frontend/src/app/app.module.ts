import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { environment } from '../environments/environment';
import { AgentQueueBoardComponentent } from './queue-board/queue-board.component';
import { AgentJoinSessionComponent } from './agent-join-session/agent-join-session.component';
import { AgentLoginComponent } from './agent-login/agent-login.component';
import { ApiModule } from './api/api.module';
import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { CustomerRegistrationComponent } from './customer-registration/customer-registration.component';
import { HomeComponent } from './home/home.component';
import { JwtInterceptor } from './interceptors/jwt-interceptor';
import { UpdateDateHttpInterceptor } from './interceptors/update-date-interceptor';
import { JoinSessionComponent } from './join-session/join-session.component';
import { AuthenticationService } from './services/authentication.service';
import { TokenService } from './services/token.service';
import { WebSocketService } from './services/websocket.service';
import { AgentLayoutComponent } from './shared/agent-layout/agent-layout.component';
import { AgentNavbarComponent } from './shared/agent-navbar/agent-navbar.component';
import { CustomerContentComponent } from './shared/customer-content/customer-content.component';
import { CustomerNavbarComponent } from './shared/customer-navbar/customer-navbar.component';
import { FormatEnumPipe } from './utils/format-enum.pipe';
import { PushNotificationsService } from './utils/push.notification.service';
import { TimeAgoExtendsPipe } from './utils/timeago.pipe';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { VideofloModule } from '@botaiml/videoflo-angular';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { FileUploadModule } from 'primeng/fileupload';
import { AuditsComponent } from './audits/audits.component';
import { ViewAuditComponent } from './view-audit/view-audit.component';
import { CardModule } from 'primeng/card';
import { NgxSpinnerModule } from "ngx-spinner";
import { VideoWithAuthComponent } from './video-player/video-player.component';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { AgentSidebarComponent } from './shared/agent-sidebar/agent-sidebar.component';
import { AgentFooterComponent } from './shared/agent-footer/agent-footer.component';
import { ConfirmationService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AgentDashboardComponent } from './agent-dashboard/agent-dashboard.component';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { GlobalErrorHandler } from './services/global-error-handler';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CustomerRegistrationComponent,
    WaitingRoomComponent,
    JoinSessionComponent,
    AgentLoginComponent,
    AgentQueueBoardComponentent,
    AgentLayoutComponent,
    AgentNavbarComponent,
    AgentJoinSessionComponent,
    CustomerNavbarComponent,
    CustomerContentComponent,
    JoinSessionComponent,
    TimeAgoExtendsPipe,
    FormatEnumPipe,
    AuditsComponent,
    ViewAuditComponent,
    VideoWithAuthComponent,
    AgentSidebarComponent,
    AgentFooterComponent,
    AgentDashboardComponent
  ],
  imports: [
    ApiModule.forRoot({ rootUrl: environment.apiURL }),
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRouting,
    HttpClientModule,
    ProgressSpinnerModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    MessagesModule,
    FileUploadModule,
    MessageModule,
    CardModule,
    NgxSpinnerModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    InputTextareaModule,
    TooltipModule,
    CheckboxModule,
    VideofloModule,
  ],
  providers: [
    WebSocketService,
    TokenService,
    AuthenticationService,
    {
      provide: ErrorHandler, useClass: GlobalErrorHandler,
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UpdateDateHttpInterceptor, multi: true },
    MessageService,
    PushNotificationsService,
    ConfirmationService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule { }
