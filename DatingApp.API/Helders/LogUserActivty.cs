using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;

namespace API.Helders
{
    public class LogUserActivty : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();
            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;
            var userId = resultContext.HttpContext.User.GetUserId();
            var userRepository = resultContext.HttpContext.RequestServices.GetService<IUserRepository>();
            var user = await userRepository.GetUserByIdAsync(userId);
            user.LastActive = DateTime.Now;
            await userRepository.SaveAllAsync();
        }
    }
}
