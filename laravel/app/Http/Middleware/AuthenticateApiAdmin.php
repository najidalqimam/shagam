<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApiAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken() ?: $request->header('X-Admin-Token');

        if (! is_string($token) || $token === '') {
            abort(401, 'Unauthorized');
        }

        $userId = Cache::get('api.admin.'.$token);
        if (! $userId) {
            abort(401, 'Unauthorized');
        }

        $user = User::query()->find($userId);
        if (! $user) {
            abort(401, 'Unauthorized');
        }

        $request->setUserResolver(fn () => $user);

        return $next($request);
    }
}
