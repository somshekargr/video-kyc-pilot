import { RouterModule, Routes } from '@angular/router';
import { AgentQueueBoardComponentent } from './queue-board/queue-board.component';
import { AgentJoinSessionComponent } from './agent-join-session/agent-join-session.component';
import { AgentLoginComponent } from './agent-login/agent-login.component';
import { AppURL } from './app.url';
import { AuditsComponent } from './audits/audits.component';
import { AuthGuard } from './auth.guard';
import { CustomerRegistrationComponent } from './customer-registration/customer-registration.component';
import { HomeComponent } from './home/home.component';
import { JoinSessionComponent } from './join-session/join-session.component';
import { ViewAuditComponent } from './view-audit/view-audit.component';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { AgentDashboardComponent } from './agent-dashboard/agent-dashboard.component';

const RouteList: Routes = [
  // { path: '', redirectTo: AppURL.Customer, pathMatch: 'full' },
  { path: AppURL.Home, component: HomeComponent },
  { path: AppURL.Customer, component: CustomerRegistrationComponent },
  { path: AppURL.WaitingRoom, component: WaitingRoomComponent },
  { path: AppURL.AgentDashboard, component: AgentDashboardComponent },
  { path: AppURL.AgentLogin, component: AgentLoginComponent },
  { path: AppURL.QueueBoard, component: AgentQueueBoardComponentent, canActivate: [AuthGuard] },
  { path: AppURL.ViewAudits, component: ViewAuditComponent, canActivate: [AuthGuard] },
  { path: AppURL.Audits, component: AuditsComponent, canActivate: [AuthGuard] },
  { path: AppURL.JoinSession, component: JoinSessionComponent, canActivate: [AuthGuard] },
  { path: AppURL.AgentJoinSession, component: AgentJoinSessionComponent, canActivate: [AuthGuard] },
];

export const AppRouting = RouterModule.forRoot(RouteList);
