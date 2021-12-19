using API.Helders;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ServiceFilter(typeof(LogUserActivty))]
    [ApiController]
    [Route("api/[controller]")]
    public class BaseController : Controller
    {

    }
}
